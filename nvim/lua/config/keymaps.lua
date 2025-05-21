--navigation
vim.keymap.set({ "x", "n", "s" }, "<A-l>", "<cmd>BufferLineCycleNext<cr><esc>", { desc = "Next Buffer" })
vim.keymap.set({ "x", "n", "s" }, "<A-h>", "<cmd>BufferLineCyclePrev<cr><esc>", { desc = "Previous Buffer" })

vim.keymap.set({ "x", "n", "s" }, "<leader>C", function()
  Snacks.bufdelete.other()
end, { desc = "Delete other buffers" })

--code actions
vim.keymap.set({ "n", "v" }, "<C-.>", vim.lsp.buf.code_action, { desc = "Code actions" })

require("which-key").add({
  --delete buffer
  {
    "<leader>c",
    desc = "Delete buffer",
    mode = { "x", "n", "s" },
    function()
      Snacks.bufdelete()
    end,
    remap = true,
  },
  {
    "<leader>C",
    desc = "Delete another buffers",
    mode = { "x", "n", "s" },
    function()
      Snacks.bufdelete.other()
    end,
    remap = true,
  },
  {
    "<leader>w",
    "<cmd>w<cr><esc>",
    desc = "Save File",
    mode = { "x", "n", "s" },
    remap = true,
  },
  {
    "<leader>ls",
    function()
      Snacks.picker.lsp_symbols({ filter = LazyVim.config.kind_filter })
    end,
    desc = "LSP Symbols",
    has = "documentSymbol",
    remap = true,
  },
  {
    "<leader>tt",
    function()
      Snacks.terminal.toggle(nil, { cwd = LazyVim.root() })
    end,
    desc = "Toggle terminal",
    mode = "n",
    remap = true,
  },
  {
    "<leader>/",
    "gcc",
    mode = { "n" },
    remap = true,
    desc = "Toggle Comment",
  },
  {
    "<leader>/",
    "gc",
    mode = { "x" },
    remap = true,
    desc = "Toggle Comment",
  },
  {
    "<C-CR>",
    "o<Esc>",
    noremap = true,
    silent = true,
    mode = "n",
    desc = "Add Line below",
  },
  {
    "<C-CR>",
    "<Esc>o",
    noremap = true,
    silent = true,
    mode = "i",
    desc = "Add Line below",
  },
  {
    "<C-S-CR>",
    "O<Esc>",
    noremap = true,
    silent = true,
    mode = "n",
    desc = "Add Line above",
  },
  {
    "<C-S-CR>",
    "<Esc>O",
    noremap = true,
    silent = true,
    mode = "i",
    desc = "Add Line above",
  },
})
