<?php

declare(strict_types=1);

namespace App\Sharing\Data;

use App\Records\Support\RecordIdentity;
use App\Sharing\Support\ShareSelectedTarget;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * One selected target as a preview's JSON selection column stores it: its record type and id, link id and
 * publication version.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class StoredSelectedTargetData extends Data
{
    public function __construct(
        public readonly string $type,
        public readonly string $id,
        public readonly string $linkId,
        public readonly string $publicationVersion,
    ) {}

    public function target(): ShareSelectedTarget
    {
        return new ShareSelectedTarget(
            new RecordIdentity($this->type, $this->id),
            $this->linkId,
            $this->publicationVersion,
        );
    }
}
