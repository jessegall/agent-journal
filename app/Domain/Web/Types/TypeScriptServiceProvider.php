<?php

declare(strict_types=1);

namespace App\Domain\Web\Types;

use Spatie\LaravelTypeScriptTransformer\LaravelData\LaravelDataTransformedProvider;
use Spatie\LaravelTypeScriptTransformer\LaravelTypeScriptTransformerExtension;
use Spatie\LaravelTypeScriptTransformer\TypeScriptTransformerApplicationServiceProvider;
use Spatie\TypeScriptTransformer\Transformers\EnumTransformer;
use Spatie\TypeScriptTransformer\TypeScriptTransformerConfigFactory;
use Spatie\TypeScriptTransformer\Writers\FlatModuleWriter;

/**
 * Generates resources/js/types/generated/index.ts from the PHP Data the pages send: `php artisan typescript:transform`.
 */
final class TypeScriptServiceProvider extends TypeScriptTransformerApplicationServiceProvider
{
    protected function configure(TypeScriptTransformerConfigFactory $config): void
    {
        $config
            ->extension(new LaravelTypeScriptTransformerExtension)
            ->transformer(new HiddenAwareDataTransformer, EnumTransformer::class)
            ->provider(LaravelDataTransformedProvider::class)
            ->transformDirectories(app_path())
            ->outputDirectory(resource_path('js/types/generated'))
            ->writer(new FlatModuleWriter('index.ts'));
    }
}
