function migrate
    set -l migration1 $argv[1]
    set -l migration2 $argv[2]
    set -l has_brand_flag (contains -- --brand $argv)

    # Проверяем, передано ли первое название
    if test -z "$migration1"
        echo "Ошибка: необходимо указать название первой миграции."
        return 1
    end

    # Выполняем миграцию для GeneralDbContext
    dotnet ef migrations add $migration1 --context GeneralDbContext

    # Если передано второе название — создаём миграцию для BrandDbContext
    if test -n "$migration2"
        dotnet ef migrations add $migration2 --context BrandDbContext
        dotnet ef database update --context GeneralDbContext
    else
        # Если нет второго аргумента, но есть --brand — только BrandDbContext
        if test $has_brand_flag
            dotnet ef migrations add $migration1 --context BrandDbContext
        else
            # Обычный случай: только GeneralDbContext и update
            dotnet ef database update --context GeneralDbContext
        end
    end
end
