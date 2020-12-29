const axios = require('axios');

/**
 * Send a Discord message using the provided webhook url.
 * @param {string} webhookUrl
 * @param {Object} Object
 * @param {string} Object.content
 * @param {string} Object.title
 * @param {string} Object.url
 * @param {string} Object.color
 * @param {Object} Object.fields
 * @returns {Promise<void>} Promise
 */
const sendMessage = async (webhookUrl, {
  content = '',
  title = null,
  url = null,
  color = '16711680', // red
  fields = {},
}) => {
  const params = {
    content,
    embeds: [
      {
        title,
        url,
        color,
        fields: Object.entries(fields).map(([name, value]) => ({
          name,
          value,
        })),
      },
    ],
  };

  if (!title && !url && !Object.keys(fields).length) {
    delete params.embeds;
  }

  await axios.post(webhookUrl, params);
};

module.exports = {
  sendMessage,
};
