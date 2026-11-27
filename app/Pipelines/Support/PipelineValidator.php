<?php

declare(strict_types=1);

namespace App\Pipelines\Support;

use App\Bus\Contracts\Pipe;
use App\Bus\Contracts\PipelineDefinition;
use App\Support\DomainEntry;
use App\Support\DomainRegistry;
use App\Support\FolderClasses;
use Illuminate\Container\Attributes\Config;
use Illuminate\Contracts\Foundation\Application;

/**
 * Checks every pipeline of core and the domains without running it: each step must take what the one before carries
 * and the last must carry the declared output (PipelineChain). php artisan journal:pipelines and a test run it.
 */
final readonly class PipelineValidator
{
    /**
     * @param  array<class-string<PipelineDefinition<object, object>>, list<class-string<Pipe>>>  $middleware
     */
    public function __construct(
        private Application $app,
        private DomainRegistry $domains,
        #[Config('journal.pipelines.middleware')]
        private array $middleware,
    ) {}

    /**
     * Every pipeline core and the domains declare, each in a Pipelines folder.
     *
     * @return list<class-string<PipelineDefinition<object, object>>>
     */
    public function pipelines(): array
    {
        $folders = [
            $this->app->path('Pipelines'),
            $this->app->path('*/Pipelines'),
            $this->app->path('*/*/Pipelines'),
            ...array_map(fn (DomainEntry $entry) => "{$entry->folder}/Pipelines", $this->domains->all()),
        ];

        return array_map(fn (string $folder) => FolderClasses::in($folder, PipelineDefinition::class), $folders)
                |> (fn ($x) => array_merge([], ...$x))
                |> array_unique(...)
                |> array_values(...);
    }

    /**
     * @param  list<class-string<PipelineDefinition<object, object>>>  $pipelines
     * @return list<string>
     */
    public function faultsOf(array $pipelines): array
    {
        $faults = array_unique(array_merge([], ...array_map($this->faultsOfOne(...), $pipelines)));
        sort($faults);

        return $faults;
    }

    /**
     * @param  class-string<PipelineDefinition<object, object>>  $pipeline
     * @return list<string>
     */
    private function faultsOfOne(string $pipeline): array
    {
        $definition = $this->app->make($pipeline);

        return new PipelineChain($definition, $this->middleware[$pipeline] ?? [], $this->app)->faults();
    }
}
