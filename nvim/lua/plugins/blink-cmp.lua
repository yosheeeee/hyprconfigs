return {
  "saghen/blink.cmp",
  ---@class PluginLspOpts
  opts = {
    signature = {
      enabled = true,
    },
    completion = {
      list = { selection = { preselect = false, auto_insert = true } },
    },
    keymap = {
      preset = "enter",
      ["<Tab>"] = {
        function(cmp)
          if cmp.is_visible() then
            cmp.insert_next()
          else
            vim.schedule(function()
              vim.api.nvim_put({ "\t" }, "c", false, true)
            end)
          end
        end,
      },
      ["<S-Tab>"] = {
        function(cmp)
          if cmp.is_visible() then
            cmp.insert_prev()
          end
        end,
      },
    },
  },
}
