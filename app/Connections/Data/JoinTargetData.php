<?php

declare(strict_types=1);

namespace App\Connections\Data;

use App\Models\Projects\Environment;
use App\Models\Projects\Project;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A connected project a Join line can join, with the environments it can land in.
 */
#[TypeScript]
final class JoinTargetData extends Data
{
    /**
     * @param  list<EnvironmentOptionData>  $environments
     */
    public function __construct(
        public readonly string $id,
        public readonly string $label,
        #[DataCollectionOf(EnvironmentOptionData::class)]
        public readonly array $environments,
    ) {}

    /**
     * The project with those of the environments that are its own.
     *
     * @param  list<Environment>  $environments
     */
    public static function fromProject(Project $project, array $environments): self
    {
        $own = array_filter($environments, fn (Environment $environment) => $environment->project_id === $project->id);

        return self::from([
            'id' => $project->id,
            'label' => $project->label,
            'environments' => array_map(
                fn (Environment $environment) => [
                    'id' => $environment->id,
                    'label' => $environment->label,
                ],
                array_values($own),
            ),
        ]);
    }
}
