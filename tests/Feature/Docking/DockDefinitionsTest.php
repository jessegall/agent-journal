<?php

declare(strict_types=1);

namespace Tests\Feature\Docking;

use App\Contracts\Records\RecordResolver;
use App\Data\RecordCard;
use App\Exceptions\DockDefinitionInvalid;
use App\Models\Message;
use App\Support\ActorContext;
use App\Support\DockDefinitions;
use App\Support\Docking\LegacyDockable;
use App\Support\Docking\LegacyDockableProvider;
use App\Support\Sources\Contracts\DockRegistration;
use Tests\Fixtures\Docking\FixtureDockable;
use Tests\Fixtures\Docking\FixtureDockableProvider;
use Tests\Fixtures\Docking\OpenGate;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * Every record type is dockable through its fallback card, an owner's own registration wins over that fallback in
 * either order, two owners of one type are refused by name, and a message's fallback card is its title alone.
 */
final class DockDefinitionsTest extends TestCase
{
    public function test_every_record_type_docks_and_one_with_no_owner_of_its_own_uses_the_fallback(): void
    {
        $types = $this->app->make(RecordResolver::class)->types();

        foreach ($types as $type) {
            $this->assertTrue($this->definitions()->offersDock($type));
        }

        $this->assertContains(Message::LINK_TYPE, $types);
        $this->assertSame(LegacyDockable::class, $this->definitions()->definition(Message::LINK_TYPE)->class);
    }

    public function test_an_owner_registration_wins_over_the_fallback_before_and_after_it_was_read(): void
    {
        $definitions = $this->definitions();
        $before = $definitions->definition(Message::LINK_TYPE);

        $definitions->register(Message::LINK_TYPE, FixtureDockable::class, FixtureDockableProvider::class);

        $this->assertSame(LegacyDockableProvider::class, $before->provider);
        $this->assertSame(FixtureDockable::class, $definitions->definition(Message::LINK_TYPE)->class);
        $this->assertFalse($definitions->offersDock(Message::LINK_TYPE));
    }

    public function test_two_owners_of_one_type_are_refused_naming_both(): void
    {
        $definitions = $this->definitions();
        $definitions->register('fixtures.item', FixtureDockable::class, FixtureDockableProvider::class);

        $this->expectExceptionObject(
            DockDefinitionInvalid::repeated('fixtures.item', FixtureDockable::class, FixtureDockable::class),
        );

        $definitions->register('fixtures.item', FixtureDockable::class, FixtureDockableProvider::class);
    }

    public function test_a_message_fallback_card_is_its_title_alone(): void
    {
        $record = RecordCard::from([
            'type' => Message::LINK_TYPE,
            'id' => 'm4',
            'number' => '4',
            'label' => 'message 4',
            'title' => 'Build ready',
            'abstract' => null,
            'route' => null,
        ]);
        $context = new OpenGate()->contextFor(ActorContext::forUser(TestIds::of(1)));

        $card = new LegacyDockable($record, null)->composeDockCard($context);

        $this->assertSame(['title'], array_map(fn ($part) => $part->key(), $card->root->children()));
        $this->assertNull($card->open);
    }

    private function definitions(): DockRegistration
    {
        return $this->app->make(DockDefinitions::class);
    }
}
