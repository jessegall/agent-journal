<?php

declare(strict_types=1);

namespace App\Support\Wire;

use App\Docking\Cards\DockLink;
use App\Support\Cards\DockIdentity;
use JsonSerializable;

/**
 * One placement's card as the browser receives it: the wire version, the placement and the source, the accessible
 * name, the safe summary shown when nothing else may be, the page it opens and its root part. A card past its budget,
 * or one whose parts cannot be written, carries no root and no page.
 */
final readonly class EncodedCard implements JsonSerializable
{
    public const int VERSION = 1;

    /**
     * @param  array<string, mixed>|null  $root
     */
    public function __construct(
        public string $placementId,
        public DockIdentity $source,
        public string $accessibleName,
        public string $safeSummary,
        public DockLink|null $open,
        public array|null $root,
    ) {}

    public function jsonSerialize(): mixed
    {
        return [
            'version' => self::VERSION,
            'placementId' => $this->placementId,
            'source' => [
                'type' => $this->source->type,
                'id' => $this->source->id,
            ],
            'accessibleName' => $this->accessibleName,
            'safeSummary' => $this->safeSummary,
            'open' => $this->open,
            'root' => $this->root,
        ];
    }
}
