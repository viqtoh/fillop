const Service = require("../models/Service");
const {Op} = require("sequelize");
const path = require("path"); // Add this
const fs = require("fs"); // Add this

const PUBLIC_DIR = path.join(__dirname, "../");
const SERVICE_MEDIA_DIR = path.join(PUBLIC_DIR, "media", "services");

// Ensure the directory exists when the service loads
if (!fs.existsSync(SERVICE_MEDIA_DIR)) {
  fs.mkdirSync(SERVICE_MEDIA_DIR, {recursive: true});
}

const serviceService = {
  /**
   * Creates a new service.
   * Handles image upload if base64 data is provided.
   * @param {object} serviceData - Data for the new service (title, fullDescription, imageUrl (base64 or URL), etc.)
   * @returns {Promise<object>} The created service instance with the correct image URL.
   */
  createService: async (serviceData) => {
    try {
      let imageUrlToStore = serviceData.imageUrl || null;

      // Check if imageUrl is base64 data (starts with "data:image")
      if (serviceData.imageUrl && serviceData.imageUrl.startsWith("data:image/")) {
        const base64Data = serviceData.imageUrl.replace(/^data:image\/\w+;base64,/, "");
        const imageBuffer = Buffer.from(base64Data, "base64");
        const fileExtension = serviceData.imageUrl.substring(
          serviceData.imageUrl.indexOf("/") + 1,
          serviceData.imageUrl.indexOf(";")
        );
        const fileName = `service_${Date.now()}.${fileExtension}`;
        const filePath = path.join(SERVICE_MEDIA_DIR, fileName);

        fs.writeFileSync(filePath, imageBuffer);
        imageUrlToStore = `/media/services/${fileName}`; // Store the public URL path
      }

      // Create service, using the generated URL or original URL
      const service = await Service.create({
        ...serviceData,
        imageUrl: imageUrlToStore
      });

      return {
        id: service.id,
        title: service.title,
        slug: service.slug,
        full_description: service.fullDescription,
        image_url: service.imageUrl, // This will now be the stored URL
        target_clients: service.targetClients,
        competitive_advantage: service.competitiveAdvantage,
        visit_link: service.visitLink,
        is_active: service.isActive
      };
    } catch (error) {
      console.error("Error in serviceService.createService:", error);
      throw error;
    }
  },

  /**
   * Retrieves all services with optional filtering, sorting, and pagination.
   * (No changes needed here as it simply returns the stored URL)
   * @param {object} options - Options for filtering, sorting, and pagination.
   * @param {string} options.search - Search term for title or fullDescription.
   * @param {number} options.page - Current page number.
   * @param {number} options.limit - Number of items per page.
   * @param {string} options.sort - Field to sort by (e.g., 'title', 'createdAt', 'updatedAt').
   * @param {string} options.order - Sort order ('asc' or 'desc').
   * @param {boolean} options.includeInactive - Whether to include inactive services.
   * @returns {Promise<object>} Object containing results, total count, total pages, etc.
   */
  getAllServices: async ({
    search,
    page = 1,
    limit = 9,
    sort = "title", // Default sort
    order = "ASC", // Default order
    includeInactive = false
  }) => {
    const where = {};
    const orderClause = [];
    let summary = "";

    // Search query
    if (search) {
      where[Op.or] = [
        {title: {[Op.iLike]: `%${search}%`}},
        {fullDescription: {[Op.iLike]: `%${search}%`}}
      ];
      summary += `Showing results for "${search}". `;
    }

    // Include inactive services or not
    if (!includeInactive) {
      where.isActive = true;
      summary += "Showing active services. ";
    } else {
      summary += "Showing all services (active and inactive). ";
    }

    // Dynamic Sorting
    const allowedSortFields = ["title", "createdAt", "updatedAt", "isActive"]; // Add other sortable fields
    const sortField = allowedSortFields.includes(sort) ? sort : "title";
    const sortOrder = ["asc", "desc"].includes(order.toLowerCase()) ? order.toUpperCase() : "ASC";
    orderClause.push([sortField, sortOrder]);
    summary += `Sorted by ${sortField} (${sortOrder}).`;

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);

    try {
      const {count, rows} = await Service.findAndCountAll({
        where,
        order: orderClause,
        offset,
        limit: parseInt(limit)
      });

      const total_pages = Math.ceil(count / parseInt(limit));

      const results = rows.map((service) => ({
        id: service.id,
        title: service.title,
        slug: service.slug,
        full_description: service.fullDescription,
        image_url: service.imageUrl, // This will be the stored URL
        target_clients: service.targetClients,
        competitive_advantage: service.competitiveAdvantage,
        visit_link: service.visitLink,
        is_active: service.isActive,
        createdAt: service.createdAt
      }));

      return {
        results,
        total_services: count,
        total_pages,
        current_page: parseInt(page),
        results_summary: summary.trim() || "Showing all services."
      };
    } catch (error) {
      console.error("Error in serviceService.getAllServices:", error);
      throw error;
    }
  },

  /**
   * Retrieves a single service by its ID or slug.
   * (No changes needed here as it simply returns the stored URL)
   * @param {string|number} identifier - The service ID or slug.
   * @param {boolean} bySlug - If true, identify by slug; otherwise, by ID.
   * @returns {Promise<object|null>} The service instance or null if not found.
   */
  getServiceByIdOrSlug: async (identifier, bySlug = false) => {
    try {
      const whereClause = bySlug ? {slug: identifier} : {id: identifier};
      const service = await Service.findOne({where: whereClause});
      if (!service) {
        return null;
      }
      return {
        id: service.id,
        title: service.title,
        slug: service.slug,
        full_description: service.fullDescription,
        image_url: service.imageUrl, // This will be the stored URL
        target_clients: service.targetClients,
        competitive_advantage: service.competitiveAdvantage,
        visit_link: service.visitLink,
        is_active: service.isActive
      };
    } catch (error) {
      console.error("Error in serviceService.getServiceByIdOrSlug:", error);
      throw error;
    }
  },

  /**
   * Updates an existing service.
   * Handles image upload if base64 data is provided.
   * @param {number} id - The ID of the service to update.
   * @param {object} updateData - Data to update the service with.
   * @returns {Promise<object|null>} The updated service instance or null if not found.
   */
  updateService: async (id, updateData) => {
    try {
      let imageUrlToUpdate = updateData.imageUrl; // Start with whatever is in updateData

      // Check if imageUrl is base64 data AND not already a stored path
      if (
        updateData.imageUrl &&
        updateData.imageUrl.startsWith("data:image/") &&
        !updateData.imageUrl.startsWith("/media/")
      ) {
        // Optional: Delete old image if it exists and is different
        const existingService = await Service.findByPk(id);
        if (
          existingService &&
          existingService.imageUrl &&
          existingService.imageUrl.startsWith("/media/services/")
        ) {
          const oldImagePath = path.join(PUBLIC_DIR, existingService.imageUrl);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath); // Delete the old file
          }
        }

        const base64Data = updateData.imageUrl.replace(/^data:image\/\w+;base64,/, "");
        const imageBuffer = Buffer.from(base64Data, "base64");
        const fileExtension = updateData.imageUrl.substring(
          updateData.imageUrl.indexOf("/") + 1,
          updateData.imageUrl.indexOf(";")
        );
        const fileName = `service_${Date.now()}.${fileExtension}`;
        const filePath = path.join(SERVICE_MEDIA_DIR, fileName);

        fs.writeFileSync(filePath, imageBuffer);
        imageUrlToUpdate = `/media/services/${fileName}`; // Store the public URL path
      }
      // If imageUrl is explicitly null/empty string, it means user removed the image.
      // In this case, also delete the old file if it exists.
      else if (
        (updateData.imageUrl === null || updateData.imageUrl === "") &&
        updateData.hasOwnProperty("imageUrl")
      ) {
        const existingService = await Service.findByPk(id);
        if (
          existingService &&
          existingService.imageUrl &&
          existingService.imageUrl.startsWith("/media/services/")
        ) {
          const oldImagePath = path.join(PUBLIC_DIR, existingService.imageUrl);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath); // Delete the old file
          }
        }
        imageUrlToUpdate = null; // Ensure it's null in DB
      }

      const [updatedRowsCount, updatedServices] = await Service.update(
        {
          ...updateData,
          imageUrl: imageUrlToUpdate // Use the processed URL
        },
        {
          where: {id},
          returning: true
        }
      );

      if (updatedRowsCount === 0) {
        return null; // Service not found
      }
      const service = updatedServices[0];
      return {
        id: service.id,
        title: service.title,
        slug: service.slug,
        full_description: service.fullDescription,
        image_url: service.imageUrl, // This will be the stored URL
        target_clients: service.targetClients,
        competitive_advantage: service.competitiveAdvantage,
        visit_link: service.visitLink,
        is_active: service.isActive
      };
    } catch (error) {
      console.error("Error in serviceService.updateService:", error);
      throw error;
    }
  },

  /**
   * Deletes a service.
   * Deletes associated image file as well.
   * @param {number} id - The ID of the service to delete.
   * @returns {Promise<number>} Number of rows deleted (0 or 1).
   */
  deleteService: async (id) => {
    try {
      const serviceToDelete = await Service.findByPk(id);
      if (!serviceToDelete) {
        return 0; // Service not found
      }

      // Delete associated image file
      if (serviceToDelete.imageUrl && serviceToDelete.imageUrl.startsWith("/media/services/")) {
        const imagePath = path.join(PUBLIC_DIR, serviceToDelete.imageUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      const deletedRows = await Service.destroy({
        where: {id}
      });
      return deletedRows;
    } catch (error) {
      console.error("Error in serviceService.deleteService:", error);
      throw error;
    }
  }
};

module.exports = serviceService;
