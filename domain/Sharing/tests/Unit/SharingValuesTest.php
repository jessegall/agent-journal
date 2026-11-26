<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Unit;

use App\Bus\CommandGrammar;
use App\Sharing\Enums\ShareRelationType;
use App\Sharing\GatewayConfiguration;
use App\Sharing\GatewayEndpoint;
use App\Sharing\GatewayHealth;
use App\Sharing\GatewayOperation;
use App\Sharing\GatewaySettings;
use App\Sharing\GatewaySetupCheck;
use App\Sharing\ShareRelation;
use App\Support\RecordIdentity;
use App\Support\ShareContentRead;
use App\Support\SharedContent;
use App\Support\ShareRecordCard;
use App\Support\ShareRecordDefinition;
use App\Support\ShareRecords;
use App\Support\ShareRelationRead;
use App\Support\ShareRelationSet;
use App\Support\ShareSelection;
use App\Support\ShareTargetRead;
use Domain\Sharing\Enums\ShareAuditType;
use Domain\Sharing\Enums\ShareStatus;
use Domain\Sharing\Support\ShareCandidates;
use Domain\Sharing\Support\ShareLinkedCandidate;
use Domain\Sharing\Support\ShareSelectedTarget;
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
        $live = array_values(array_filter(ShareStatus::cases(), fn (ShareStatus $status) => $status->isLive()));
        $terminal = array_values(array_filter(ShareStatus::cases(), fn (ShareStatus $status) => $status->isTerminal()));
        $retryable = array_values(array_filter(ShareStatus::cases(), fn (ShareStatus $status) => $status->mayRetry()));

        $this->assertSame([ShareStatus::Pending, ShareStatus::Active, ShareStatus::Failed], $live);

        $this->assertSame([ShareStatus::Revoked, ShareStatus::Expired], $terminal);

        $this->assertSame([ShareStatus::Pending, ShareStatus::Failed], $retryable);
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
            ShareRelation::class,
            ShareRelationSet::class,
            ShareRecordDefinition::class,
            ShareRecordCard::class,
            ShareRecords::class,
            ShareCandidates::class,
            ShareLinkedCandidate::class,
            ShareSelection::class,
            ShareTargetRead::class,
            ShareRelationRead::class,
            ShareContentRead::class,
            SharedContent::class,
            GatewayConfiguration::class,
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
            static fn (string $name) => preg_match('/Share|Gateway/', class_basename($name)) === 1
                || $name === RecordIdentity::class,
        );

        $this->assertNull($grammar->problemWithProperties($class));
    }
}
