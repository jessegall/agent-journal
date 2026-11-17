<?php

declare(strict_types=1);

namespace App\Domain\Web\Providers;

use App\Domain\Web\Types\HiddenAwareDataTransformer;
use Spatie\LaravelTypeScriptTransformer\LaravelData\LaravelDataTypeScriptTransformerExtension;
use Spatie\LaravelTypeScriptTransformer\LaravelData\Transformers\DataClassTransformer;
use Spatie\LaravelTypeScriptTransformer\TypeScriptTransformerApplicationServiceProvider;
use Spatie\TypeScriptTransformer\Transformers\EnumTransformer;
use Spatie\TypeScriptTransformer\TypeScriptTransformerConfigFactory;
use Spatie\TypeScriptTransformer\Writers\FlatModuleWriter;

/**
 * The TypeScript transformer's configuration (version 3 configures in this provider; it has no config file): the
 * official Laravel Data extension, with its Data transformer swapped for our hidden-aware one, and enums. It writes
 * resources/js/types/generated/index.ts on `php artisan typescript:transform`.
 */
final class TypeScriptServiceProvider extends TypeScriptTransformerApplicationServiceProvider
{
    protected function configure(TypeScriptTransformerConfigFactory $config): void
    {
        $config
            ->extension(new LaravelDataTypeScriptTransformerExtension)
            ->replaceTransformer(DataClassTransformer::class, new HiddenAwareDataTransformer)
            ->transformer(EnumTransformer::class)
            ->transformDirectories(app_path())
            ->outputDirectory(resource_path('js/types/generated'))
            ->writer(new FlatModuleWriter('index.ts'));
    }
}
