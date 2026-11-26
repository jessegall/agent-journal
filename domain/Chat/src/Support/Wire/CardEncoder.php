<?php

declare(strict_types=1);

namespace Domain\Chat\Support\Wire;

use Domain\Chat\Contracts\Docking\CardEncoder as CardEncoderContract;
use Domain\Chat\Contracts\Docking\DockPart;
use Domain\Chat\Support\Cards\DockCard;
use Domain\Chat\Support\Cards\DockIdentity;

/**
 * Writes a card for the browser through the part map: each part as its mapped literal type, its key, its fields and
 * its children. A card past its node or byte budget keeps only its summary.
 */
final readonly class CardEncoder implements CardEncoderContract
{
    public function __construct(private PartMap $parts, private DestinationEncoder $destinations) {}

    public function encode(DockCard $card, string $placementId, DockIdentity $source, string $safeSummary): EncodedCard
    {
        $root = $this->node($card->root);

        if ($card->isOverBudget || strlen((string) json_encode($root)) > DockCard::BYTE_LIMIT) {
            return new EncodedCard($placementId, $source, $card->accessibleName, $safeSummary, null, null);
        }

        $open = $card->open === null ? null : $this->destinations->encode($card->open);

        return new EncodedCard($placementId, $source, $card->accessibleName, $safeSummary, $open, $root);
    }

    /**
     * @return array<string, mixed>
     */
    private function node(DockPart $part): array
    {
        $descriptor = $this->parts->descriptorOf($part);
        $node = ['type' => $descriptor->type->value, 'key' => $part->key()];

        foreach ($descriptor->fields as $field) {
            $node[$field->name()] = $field->encode($part, $this->destinations);
        }

        if ($descriptor->type->isContainer()) {
            $node['children'] = array_map($this->node(...), $part->children());
        }

        return $node;
    }
}
