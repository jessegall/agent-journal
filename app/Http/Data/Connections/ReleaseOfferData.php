<?php

declare(strict_types=1);

namespace App\Http\Data\Connections;

use App\Agents\Values\ReleaseManifest;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What the current release offers a machine that connects: its platforms and the capabilities it still lacks.
 */
#[TypeScript]
final class ReleaseOfferData extends Data
{
    /**
     * @param  list<ReleaseTargetData>  $targets
     * @param  list<string>  $missingCapabilities
     */
    public function __construct(
        public readonly string|null $release,
        #[DataCollectionOf(ReleaseTargetData::class)]
        public readonly array $targets,
        public readonly array $missingCapabilities,
    ) {}

    /**
     * The offer of the published manifest, none or one; with none every capability is missing.
     *
     * @param  list<ReleaseManifest>  $published
     */
    public static function ofPublished(array $published): self
    {
        if ($published === []) {
            return self::from([
                'release' => null,
                'targets' => [],
                'missingCapabilities' => ReleaseManifest::REQUIRED_CAPABILITIES,
            ]);
        }

        $manifest = $published[0];

        return self::from([
            'release' => $manifest->version,
            'targets' => array_map(ReleaseTargetData::fromTarget(...), $manifest->targets),
            'missingCapabilities' => $manifest->missingCapabilities(),
        ]);
    }
}
