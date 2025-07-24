function dema --wraps='dotnet ef migrations add' --description 'alias dema=dotnet ef migrations add'
  dotnet ef migrations add $argv
        
end
