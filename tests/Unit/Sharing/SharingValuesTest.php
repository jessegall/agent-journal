<?php

declare(strict_types=1);

namespace Tests\Unit\Sharing;

use App\Enums\ShareAuditType;
use App\Enums\ShareRelationType;
use App\Enums\ShareState;
use App\Support\CommandGrammar;
use App\Support\GatewayConfiguration;
use App\Support\GatewayEndpoint;
use App\Support\GatewayHealth;
use App\Support\GatewayOperation;
use App\Support\GatewaySettings;
use App\Support\GatewaySetupCheck;
use App\Support\RecordIdentity;
use App\Support\ShareCandidates;
use App\Support\ShareContentRead;
use App\Support\SharedContent;
use App\Support\ShareLinkedCandidate;
use App\Support\ShareRecordCard;
use App\Support\ShareRecordDefinition;
use App\Support\ShareRecords;
use App\Support\ShareRelation;
use App\Support\ShareRelationRead;
use App\Support\ShareRelationSet;
use App\Support\ShareSelectedTarget;
use App\Support\ShareSelection;
use App\Support\ShareTargetRead;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

/**
 * The sharing values and enums: states answer which are live, terminal or retryable, relation sets are built from
 * their named factories, and every value fits the bus grammar so commands and results may carry it.
 */
final class SharingValuesTest extends TestCase
{
    public function test_live_terminal_and_retryable_states_are_answered_by_the_state(): void
    {
        $live = array_values(array_filter(ShareState::cases(), fn (ShareState $state) => $state->isLive()));
        $terminal = array_values(array_filter(ShareState::cases(), fn (ShareState $state) => $state->isTerminal()));
        $retryable = array_values(array_filter(ShareState::cases(), fn (ShareState $state) => $state->mayRetry()));

        $this->assertSame([ShareState::Pending, ShareState::Active, ShareState::Failed], $live);
        $this->assertSame([ShareState::Revoked, ShareState::Expired], $terminal);
        $this->assertSame([ShareState::Pending, ShareState::Failed], $retryable);
    }

    public function test_the_twelve_audit_types_split_into_reads_and_life_steps(): void
    {
        $reads = array_values(array_filter(ShareAuditType::cases(), fn (ShareAuditType $type) => $type->isRead()));

        $this->assertCount(12, ShareAuditType::cases());
        $this->assertSame([ShareAuditType::ReadAllowed, ShareAuditType::ReadDenied], $reads);
    }

    public function test_relation_sets_are_built_owned_linked_empty_or_together(): void
    {
        $comments = new ShareRelation('comments', ShareRelationType::Owned, 'share-comment');
        $records = new ShareRelation('records', ShareRelationType::Linked, 'share-linked-record');

        $this->assertEquals([$comments], ShareRelationSet::owned('comments', 'share-comment')->relations);
        $this->assertEquals([$records], ShareRelationSet::linked('records', 'share-linked-record')->relations);
        $this->assertSame([], ShareRelationSet::none()->relations);
        $this->assertEquals(
            [$comments, $records],
            ShareRelationSet::owned('comments', 'share-comment')->with(
                ShareRelationSet::linked('records', 'share-linked-record'),
            )->relations,
        );
    }

    public function test_a_page_of_records_has_more_only_with_a_continuation_and_problems_mean_not_ready(): void
    {
        $this->assertTrue(new ShareRecords([], [], 'next')->hasMore());
        $this->assertFalse(new ShareRecords([], [], null)->hasMore());
        $this->assertTrue(GatewaySetupCheck::passed()->isComplete());
        $this->assertFalse(new GatewaySetupCheck(['The tunler program is not installed.'])->isComplete());
        $this->assertTrue(GatewayHealth::healthy()->isHealthy());
        $this->assertFalse(new GatewayHealth(['The probe was redirected.'])->isHealthy());
    }

    /**
     * @return iterable<string, array{class-string}>
     */
    public static function values(): iterable
    {
        foreach ([
            ShareRelation::class, ShareRelationSet::class, ShareRecordDefinition::class, ShareRecordCard::class,
            ShareRecords::class,
            ShareCandidates::class,
            ShareLinkedCandidate::class,
            ShareSelection::class,
            ShareTargetRead::class,
            ShareRelationRead::class, ShareContentRead::class, SharedContent::class, GatewayConfiguration::class,
            GatewayOperation::class,
            GatewayEndpoint::class,
            GatewaySetupCheck::class,
            GatewayHealth::class,
            GatewaySettings::class,
            ShareSelectedTarget::class,
        ] as $class) {
            yield class_basename($class) => [$class];
        }
    }

    /**
     * @param  class-string  $class
     */
    #[DataProvider('values')]
    public function test_every_sharing_value_fits_the_bus_grammar(string $class): void
    {
        $grammar = new CommandGrammar(
            static fn (string $name): bool => str_starts_with(
                $name,
                'App\\Sharing\\',
            ) || $name === RecordIdentity::class,
        );

        $this->assertNull($grammar->problemWithProperties($class));
    }
}
