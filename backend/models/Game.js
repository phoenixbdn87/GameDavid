const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  platform: {
    type: [String],
    required: true,
    validate: {
      validator: function(platforms) {
        const validPlatforms = ['PS5', 'Switch', 'Xbox', 'Steam'];
        return platforms.every(platform => validPlatforms.includes(platform));
      },
      message: props => `${props.value} contiene plataformas inválidas`
    }
  },
  image: {
    type: String,
    required: true
  },
  futurible: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Game', gameSchema); 