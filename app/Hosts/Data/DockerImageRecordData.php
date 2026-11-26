<?php

declare(strict_types=1);

namespace App\Hosts\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * What docs/accounts/docker-images.json holds: every image the build script recorded.
 */
final class DockerImageRecordData extends Data
{
    /**
     * @param  list<DockerImageData>  $images
     */
    public function __construct(
        public readonly string $note,
        #[DataCollectionOf(DockerImageData::class)]
        public readonly array $images,
    ) {}

    /**
     * Whether the record holds the given reference as the agent image.
     */
    public function hasAgentImage(string $reference): bool
    {
        foreach ($this->images as $image) {
            if ($image->isAgentImage($reference)) {
                return true;
            }
        }

        return false;
    }
}
