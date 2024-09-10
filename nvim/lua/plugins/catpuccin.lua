return {
  {
    "catppuccin/nvim",
    name = "catppuccin",
    config = function()
      require("catppuccin").setup {
        flavour = "frappe", -- or 'latte', 'macchiato', 'mocha'
        transparent_background = true,

        custom_highlights = function(colors)
          return {
            Comment = { fg = colors.subtext1 },
            LineNr = { fg = colors.overlay0 },
            CursorLine = { bg = colors.none },
          }
        end,
      }
      vim.cmd.colorscheme "catppuccin"
    end,
  },
}
