<?php

declare(strict_types=1);

namespace App\Support;

use App\Attributes\DecodesAnyJson;
use App\Contracts\Files\WorkspaceSource;
use App\Exceptions\WorkspaceSourceMissing;
use App\Exceptions\WorkspaceSourcesInvalid;
use JsonException;
use Spatie\LaravelData\Exceptions\CannotCreateData;

/**
 * Where each contained environment's workspace comes from, read once from AGENTS_WORKSPACES; the one place that
 * reads the setting.
 */
final readonly class WorkspaceSources
{
    /**
     * @param  array<string, WorkspaceSource>  $sources
     */
    private function __construct(private array $sources) {}

    /**
     * Its keys are the operator's environment names, so the map is decoded loose; each entry goes into its own Data.
     *
     * @throws WorkspaceSourcesInvalid
     */
    #[DecodesAnyJson]
    public static function fromJson(string $json, string $installationName): self
    {
        try {
            $entries = json_decode($json, true, 8, JSON_THROW_ON_ERROR);
        } catch (JsonException $invalid) {
            throw WorkspaceSourcesInvalid::malformed($invalid);
        }

        if (! is_array($entries) || ($entries !== [] && array_is_list($entries))) {
            throw WorkspaceSourcesInvalid::malformed();
        }

        $sources = [];

        foreach ($entries as $environment => $entry) {
            $sources[(string) $environment] = self::sourceOf((string) $environment, $entry, $installationName);
        }

        return new self($sources);
    }

    /**
     * @throws WorkspaceSourceMissing
     */
    public function for(string $environment): WorkspaceSource
    {
        return $this->sources[$environment] ?? throw WorkspaceSourceMissing::for($environment);
    }

    /**
     * One environment's entry: a folder, or a Git source whose volume is the environment's own.
     *
     * @throws WorkspaceSourcesInvalid
     */
    private static function sourceOf(string $environment, mixed $entry, string $installationName): WorkspaceSource
    {
        if (! is_array($entry)) {
            throw WorkspaceSourcesInvalid::malformed();
        }

        if (array_key_exists('git', $entry) && array_key_exists('folder', $entry)) {
            throw WorkspaceSourcesInvalid::gitAndFolder($environment);
        }

        try {
            if (array_key_exists('folder', $entry)) {
                return FolderWorkspace::from($entry);
            }

            return GitWorkspace::from([
                ...$entry,
                'volume' => "{$installationName}-workspace-{$environment}",
            ]);
        } catch (CannotCreateData $incomplete) {
            throw WorkspaceSourcesInvalid::incomplete($environment, $incomplete);
        }
    }
}
