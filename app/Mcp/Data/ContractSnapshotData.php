<?php

declare(strict_types=1);

namespace App\Mcp\Data;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * The MCP contract as docs/mcp/contract-v1.json records it: its version, the protocol versions served, each
 * discovery profile's tools, the resources and the refusal codes.
 */
#[MapName(SnakeCaseMapper::class)]
final class ContractSnapshotData extends Data
{
    /**
     * @param  list<string>  $protocolVersions
     * @param  array<string, array<string, mixed>>  $profiles  profile => tool name => its definition
     * @param  array<string, mixed>  $resources  resource name => its definition
     * @param  list<string>  $refusalCodes
     */
    public function __construct(
        public readonly string $contractVersion,
        public readonly array $protocolVersions,
        public readonly array $profiles,
        public readonly array $resources,
        public readonly array $refusalCodes,
    ) {}

    /**
     * The fields compared as a whole, the profiles and resources left out to be compared entry by entry.
     *
     * @return array<string, mixed>
     */
    public function headline(): array
    {
        return [
            'contract_version' => $this->contractVersion,
            'protocol_versions' => $this->protocolVersions,
            'refusal_codes' => $this->refusalCodes,
        ];
    }
}
