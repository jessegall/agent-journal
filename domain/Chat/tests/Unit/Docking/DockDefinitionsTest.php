<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Unit\Docking;

use App\Data\Pages\RecordCard;
use App\Models\Messages\Message;
use App\Processes\Enums\Tone;
use App\Records\Contracts\RecordResolver;
use App\Records\Contracts\RecordSummaries;
use App\Records\Values\RecordStanding;
use App\Records\Values\RecordSummary;
use App\Records\Values\SummaryLine;
use App\Records\Values\SummaryPage;
use App\Records\Values\SummaryPeriod;
use App\Records\Values\SummaryProgress;
use App\Support\ActorReference;
use DateTimeImmutable;
use Domain\Chat\Contracts\Docking\DockRegistration as DockRegistrationContract;
use Domain\Chat\Exceptions\DockDefinitionInvalid;
use Domain\Chat\Support\Docking\DockRegistration;
use Domain\Chat\Support\Docking\LinkCardDockable;
use Domain\Chat\Support\Docking\LinkCardDockableProvider;
use Domain\Chat\Support\Docking\SummaryDockable;
use Domain\Chat\Support\Docking\SummaryDockableProvider;
use Domain\Chat\Tests\Fixtures\Docking\FixtureDockable;
use Domain\Chat\Tests\Fixtures\Docking\FixtureDockableProvider;
use Domain\Chat\Tests\Fixtures\Docking\FixtureSummaries;
use Domain\Chat\Tests\Fixtures\Docking\OpenGate;
use Domain\Chat\Tests\TestCase;
use Tests\Support\TestIds;

/**
 * Every record type is dockable through its fallback card, a summarized type as its owner's summary, a registration
 * of the chat's own wins over that fallback in either order, two registrations of one type are refused by name, a
 * message's fallback card is its title alone, and a summary card shows its parts in one order.
 */
final class DockDefinitionsTest extends TestCase
{
    private const string SUMMARIZED_TYPE = 'fixtures.summarized';

    public function test_every_record_type_docks_and_one_with_no_owner_of_its_own_uses_the_fallback(): void
    {
        $types = $this->app->make(RecordResolver::class)->types();

        foreach ($types as $type) {
            $this->assertTrue($this->definitions()->offersDock($type));
        }

        $this->assertContains(Message::linkType(), $types);
        $this->assertSame(LinkCardDockable::class, $this->definitions()->definition(Message::linkType())->class);
    }

    public function test_an_owner_registration_wins_over_the_fallback_before_and_after_it_was_read(): void
    {
        $definitions = $this->definitions();
        $before = $definitions->definition(Message::linkType());

        $definitions->register(Message::linkType(), FixtureDockable::class, FixtureDockableProvider::class);

        $this->assertSame(LinkCardDockableProvider::class, $before->provider);
        $this->assertSame(FixtureDockable::class, $definitions->definition(Message::linkType())->class);
        $this->assertTrue($definitions->offersDock(Message::linkType()));
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
            'type' => Message::linkType(),
            'id' => 'm4',
            'number' => '4',
            'label' => 'message 4',
            'title' => 'Build ready',
            'abstract' => null,
            'route' => null,
        ]);

        $context = new OpenGate()->contextFor(ActorReference::forUser(TestIds::of(1)));

        $card = new LinkCardDockable($record, null)->composeDockCard($context);

        $this->assertSame(['title'], array_map(fn ($part) => $part->key(), $card->root->children()));
        $this->assertNull($card->open);
    }

    public function test_a_summarized_record_type_docks_as_its_owners_summary(): void
    {
        $this->app->make(RecordSummaries::class)->register(self::SUMMARIZED_TYPE, FixtureSummaries::class);

        $definition = $this->definitions()->definition(self::SUMMARIZED_TYPE);

        $this->assertTrue($this->definitions()->offersDock(self::SUMMARIZED_TYPE));
        $this->assertSame(SummaryDockable::class, $definition->class);
        $this->assertSame(SummaryDockableProvider::class, $definition->provider);
    }

    public function test_a_summary_card_shows_its_title_standing_period_lines_progress_and_page_in_order(): void
    {
        $summary = new RecordSummary(
            'r1',
            'Release',
            new RecordStanding('Working', Tone::Note),
            [
                new SummaryLine('holder', 'Ada'),
                new SummaryLine('step-0', '1 · Build', new RecordStanding('Done', Tone::Muted)),
            ],
            new SummaryProgress(1, 3),
            new SummaryPeriod(new DateTimeImmutable('2026-01-01 10:00')),
            new SummaryPage('plans.plan', 'plan', '12'),
        );

        $context = new OpenGate()->contextFor(ActorReference::forUser(TestIds::of(1)));

        $card = new SummaryDockable($summary)->composeDockCard($context);

        $this->assertSame(
            ['title', 'state', 'duration', 'holder', 'step-0', 'progress', 'open'],
            array_map(fn ($part) => $part->key(), $card->root->children()),
        );
    }

    public function test_a_summary_with_no_page_offers_no_open(): void
    {
        $context = new OpenGate()->contextFor(ActorReference::forUser(TestIds::of(1)));

        $card = new SummaryDockable(new RecordSummary('r1', 'Release'))->composeDockCard($context);

        $this->assertSame(['title'], array_map(fn ($part) => $part->key(), $card->root->children()));
    }

    private function definitions(): DockRegistrationContract
    {
        return $this->app->make(DockRegistration::class);
    }
}
