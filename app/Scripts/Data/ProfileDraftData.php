<?php

declare(strict_types=1);

namespace App\Scripts\Data;

use App\Profiles\Data\ScriptDiagnostic;
use App\Profiles\Values\ScriptSource;
use App\Scripts\Values\ScriptCheck;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A profile's shared draft as every editor reads it: its revision, its script text and command definitions, and what
 * checking it found, against the catalogue it was checked with.
 */
#[TypeScript]
final class ProfileDraftData extends Data
{
    /**
     * @param  array<string, mixed>  $commands
     * @param  list<ScriptDiagnostic>  $diagnostics
     */
    public function __construct(
        public readonly string $profile,
        public readonly int $revision,
        public readonly string $source,
        public readonly array $commands,
        #[DataCollectionOf(ScriptDiagnostic::class)]
        public readonly array $diagnostics,
        public readonly string|null $graphDigest,
        public readonly string $catalogueDigest,
        public readonly FlowGraphData|Optional $flowchart,
    ) {}

    /**
     * The draft at a revision with what one check of its source found; a source that compiles has a flowchart.
     */
    public static function fromCheck(string $profile, int $revision, ScriptSource $source, ScriptCheck $check): self
    {
        $fields = [
            'profile' => $profile,
            'revision' => $revision,
            'source' => $source->text,
            'commands' => $source->definitions(),
            'diagnostics' => $check->diagnostics,
            'graphDigest' => $check->compiled?->definitionDigest,
            'catalogueDigest' => $check->catalogueDigest,
        ];

        if ($check->compiled !== null) {
            $fields['flowchart'] = FlowGraphData::fromCompiled($check->compiled);
        }

        return self::from($fields);
    }
}
