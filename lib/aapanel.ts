import axios from "axios";

interface AAPanelConfig {
  url: string;
  apiKey: string;
}

interface CreateWebsiteParams {
  domain: string;
  php_version: string;
  ssl: boolean;
}

export class AAPanelService {
  private baseUrl: string;
  private apiKey: string;

  constructor(config: AAPanelConfig) {
    this.baseUrl = config.url;
    this.apiKey = config.apiKey;
  }

  /**
   * Generate timestamp dan signature untuk aaPanel API
   */
  private getAuthHeaders() {
    const timestamp = Math.floor(Date.now() / 1000);
    return {
      "Content-Type": "application/json",
      "X-Auth-Token": this.apiKey,
      timestamp: timestamp.toString(),
    };
  }

  /**
   * Buat website/hosting baru di aaPanel
   */
  async createWebsite(params: CreateWebsiteParams) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/api/website/create`,
        {
          domain: params.domain,
          php_version: params.php_version || "74",
          ssl: params.ssl || true,
          ftp: true, // Enable FTP
          database: true, // Create database
        },
        {
          headers: this.getAuthHeaders(),
        },
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error(
        "aaPanel create website error:",
        error.response?.data || error,
      );
      return {
        success: false,
        error: error.response?.data?.msg || "Gagal membuat website",
      };
    }
  }

  /**
   * Get info website
   */
  async getWebsite(siteId: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/api/website/get`, {
        params: { id: siteId },
        headers: this.getAuthHeaders(),
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error(
        "aaPanel get website error:",
        error.response?.data || error,
      );
      return {
        success: false,
        error: error.response?.data?.msg || "Gagal mengambil info website",
      };
    }
  }

  /**
   * Hapus website
   */
  async deleteWebsite(siteId: string) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/api/website/delete`,
        { id: siteId },
        {
          headers: this.getAuthHeaders(),
        },
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error(
        "aaPanel delete website error:",
        error.response?.data || error,
      );
      return {
        success: false,
        error: error.response?.data?.msg || "Gagal menghapus website",
      };
    }
  }

  /**
   * Upload file ke website via FTP
   */
  async uploadFile(siteId: string, localPath: string, remotePath: string) {
    try {
      // Untuk upload file, kita bisa gunakan FTP langsung
      // Atau menggunakan aaPanel file manager API
      const response = await axios.post(
        `${this.baseUrl}/api/files/upload`,
        {
          site_id: siteId,
          local_path: localPath,
          remote_path: remotePath,
        },
        {
          headers: this.getAuthHeaders(),
        },
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error(
        "aaPanel upload file error:",
        error.response?.data || error,
      );
      return {
        success: false,
        error: error.response?.data?.msg || "Gagal upload file",
      };
    }
  }

  /**
   * Extract zip file di server
   */
  async extractZip(siteId: string, zipPath: string, extractTo: string) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/api/files/extract`,
        {
          site_id: siteId,
          zip_path: zipPath,
          extract_to: extractTo,
        },
        {
          headers: this.getAuthHeaders(),
        },
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error(
        "aaPanel extract zip error:",
        error.response?.data || error,
      );
      return {
        success: false,
        error: error.response?.data?.msg || "Gagal extract file",
      };
    }
  }

  /**
   * Set permission folder/file
   */
  async setPermission(siteId: string, path: string, permission: string) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/api/files/permission`,
        {
          site_id: siteId,
          path: path,
          permission: permission, // e.g., "755", "644"
        },
        {
          headers: this.getAuthHeaders(),
        },
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error(
        "aaPanel set permission error:",
        error.response?.data || error,
      );
      return {
        success: false,
        error: error.response?.data?.msg || "Gagal set permission",
      };
    }
  }
}

// Export singleton instance
let aapanelInstance: AAPanelService | null = null;

export const getAAPanelService = (): AAPanelService => {
  if (!aapanelInstance) {
    aapanelInstance = new AAPanelService({
      url: process.env.AAPANEL_URL || "",
      apiKey: process.env.AAPANEL_API_KEY || "",
    });
  }
  return aapanelInstance;
};
