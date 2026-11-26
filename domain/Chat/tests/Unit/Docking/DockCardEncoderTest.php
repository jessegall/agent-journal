<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Unit\Docking;

use Domain\Chat\Enums\PartType;
use Domain\Chat\Exceptions\PartMapInvalid;
use Domain\Chat\Support\Cards\DockCard;
use Domain\Chat\Support\Cards\DockIdentity;
use Domain\Chat\Support\Cards\Stack;
use Domain\Chat\Support\Cards\Subtitle;
use Domain\Chat\Support\Cards\Title;
use Domain\Chat\Support\Wire\CardEncoder;
use Domain\Chat\Support\Wire\DockNodeTypes;
use Domain\Chat\Support\Wire\PartMap;
use Domain\Chat\Tests\TestCase;

/**
 * A card goes on the wire through the one part map: each part as its literal type, and the TypeScript union is
 * written from the same map, so a part left out of it fails both.
 */
final class DockCardEncoderTest extends TestCase
{
    private const string EXAMPLE_ENVELOPE = '{"version":1,"placementId":"P7","source":{"type":"message","id":"M4"},'
        .'"accessibleName":"Message 4","safeSummary":"Message 4","open":null,"root":{"type":"stack","key":"root",'
        .'"children":[{"type":"subtitle","key":"status","text":"Ready"}]}}';

    public function test_the_design_example_card_is_written_as_its_envelope(): void
    {
        $card = DockCard::named('Message 4', Stack::of('root', new Subtitle('status', 'Ready')));

        $encoded = $this->app->make(CardEncoder::class)->encode($card, 'P7', new DockIdentity('message', 'M4'), 'Message 4');

        $this->assertSame(self::EXAMPLE_ENVELOPE, json_encode($encoded));
    }

    public function test_a_card_over_its_budget_keeps_only_its_summary(): void
    {
        $titles = array_map(fn (int $index) => new Title("title-{$index}", 'x'), range(1, DockCard::NODE_LIMIT));
        $card = DockCard::named('Many', Stack::of('root', ...$titles));

        $encoded = $this->app->make(CardEncoder::class)->encode($card, 'P1', new DockIdentity('message', 'M1'), 'Many');

        $this->assertNull($encoded->root);
        $this->assertNull($encoded->open);
    }

    public function test_the_typescript_union_names_every_part(): void
    {
        $union = collect(new DockNodeTypes(PartMap::standard())->provide())
            ->first(fn ($transformed) => $transformed->getName() === 'DockNode');

        $this->assertNotNull($union);
        $this->assertCount(count(PartType::cases()), PartMap::standard()->descriptors());
    }

    public function test_a_map_that_leaves_a_part_out_is_refused(): void
    {
        $map = new PartMap();
        $map->part(Stack::class, PartType::Stack);

        $this->expectExceptionObject(PartMapInvalid::unmappedType(PartType::Row->value));

        $map->assertEveryTypeMapped();
    }
}
