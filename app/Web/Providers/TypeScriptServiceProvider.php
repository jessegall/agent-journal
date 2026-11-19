<?php

declare(strict_types=1);

namespace App\Web\Providers;

use App\Domains\Support\DomainEntry;
use App\Domains\Support\DomainRegistry;
use App\Ui\Support\UiDeclarations;
use App\Web\Types\DomainTypeWriter;
use App\Web\Types\HiddenAwareDataTransformer;
use App\Web\Types\TypeOwners;
use Spatie\LaravelTypeScriptTransformer\LaravelData\LaravelDataTypeScriptTransformerExtension;
use Spatie\LaravelTypeScriptTransformer\LaravelData\Transformers\DataClassTransformer;
use Spatie\LaravelTypeScriptTransformer\TypeScriptTransformerApplicationServiceProvider;
use Spatie\TypeScriptTransformer\Transformers\EnumTransformer;
use Spatie\TypeScriptTransformer\TypeScriptTransformerConfigFactory;

/**
 * The TypeScript transformer's configuration (version 3 configures in this provider; it has no config file): the
 * official Laravel Data extension, with its Data transformer swapped for our hidden-aware one, and enums, read from app
 * and every installed domain's folder. On `php artisan typescript:transform` it writes each owner's types to
 * resources/js/generated/types/<owner>/index.ts and keeps resources/js/types/generated/index.ts re-exporting them.
 */
final class TypeScriptServiceProvider extends TypeScriptTransformerApplicationServiceProvider
{
    public function register(): void
    {
        parent::register();
        $this->app->singleton(
            TypeOwners::class,
            fn () => TypeOwners::of($this->app->make(DomainRegistry::class), $this->app->make(UiDeclarations::class)),
        );
    }

    protected function configure(TypeScriptTransformerConfigFactory $config): void
    {
        $registry = $this->app->make(DomainRegistry::class);
        $config
            ->extension(new LaravelDataTypeScriptTransformerExtension())
            ->replaceTransformer(DataClassTransformer::class, new HiddenAwareDataTransformer())
            ->transformer(EnumTransformer::class)
            ->transformDirectories(...$this->sourceFolders($registry))
            ->outputDirectory(resource_path('js'))
            ->writer(new DomainTypeWriter($this->app->make(TypeOwners::class)));
    }

    /**
     * app, and the folder of every installed domain that lives outside it.
     *
     * @return list<string>
     */
    private function sourceFolders(DomainRegistry $registry): array
    {
        $outside = array_filter(
            array_map(fn (DomainEntry $entry) => $entry->folder, $registry->all()),
            fn (string $folder) => ! str_starts_with($folder, app_path()),
        );

        return array_values(array_unique([app_path(), ...$outside]));
    }
}
