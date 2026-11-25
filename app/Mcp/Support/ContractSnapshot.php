<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use App\Enums\Engine\RefusalCode;
use App\Mcp\Data\ContractSnapshotData;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Servers\JournalServer;
use Laravel\Mcp\Enums\ProtocolVersion;

final readonly class ContractSnapshot
{
    public const string PATH = 'docs/mcp/contract-v1.json';

    private const int JSON_FLAGS = JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE;

    public function __construct(private McpCatalogue $catalogue) {}

    public function render(): string
    {
        $profiles = [];

        foreach (DiscoveryProfile::cases() as $profile) {
            $profiles[$profile->value] = $this->catalogue->toolDefinitionsFor($profile);
        }

        $versions = array_unique([
            ...ProtocolVersion::serverSupported(),
            ...ProtocolVersion::initializeSupported(),
        ]);
        sort($versions);
        $refusals = array_column(RefusalCode::cases(), 'value');
        sort($refusals);

        return json_encode(self::sorted([
            'contract_version' => JournalServer::contractVersion(),
            'protocol_versions' => $versions,
            'profiles' => $profiles,
            'resources' => $this->catalogue->resourceDefinitions(),
            'refusal_codes' => $refusals,
        ]), self::JSON_FLAGS | JSON_PRETTY_PRINT)."\n";
    }

    /**
     * @return list<string>
     */
    public function differences(string $recorded, string $current): array
    {
        $before = ContractSnapshotData::from(json_decode($recorded, true, flags: JSON_THROW_ON_ERROR));
        $after = ContractSnapshotData::from(json_decode($current, true, flags: JSON_THROW_ON_ERROR));

        $changes = [
            ...$this->changedFields($before->topLevelFields(), $after->topLevelFields()),
            ...$this->changedFields($before->resources, $after->resources),
        ];

        $oldProfiles = $before->profiles;
        $newProfiles = $after->profiles;

        foreach (array_unique([
            ...array_keys($oldProfiles),
            ...array_keys($newProfiles),
        ]) as $profile) {
            $tools = $this->changedFields(
                $oldProfiles[$profile] ?? [],
                $newProfiles[$profile] ?? [],
            );

            foreach ($tools as $tool) {
                $changes[] = $profile.'/'.$tool;
            }
        }

        return $changes;
    }

    /**
     * @param  array<string, mixed>  $before
     * @param  array<string, mixed>  $after
     * @return list<string>
     */
    private function changedFields(array $before, array $after): array
    {
        $fields = array_unique([
            ...array_keys($before),
            ...array_keys($after),
        ]);

        return array_values(array_filter(
            $fields,
            fn (string $name): bool => json_encode($before[$name] ?? null, self::JSON_FLAGS)
                !== json_encode($after[$name] ?? null, self::JSON_FLAGS),
        ));
    }

    private static function sorted(mixed $node): mixed
    {
        if (! is_array($node)) {
            return $node;
        }

        if (! array_is_list($node)) {
            ksort($node, SORT_STRING);
        }

        return array_map(self::sorted(...), $node);
    }
}
