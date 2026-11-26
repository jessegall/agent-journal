<?php

declare(strict_types=1);

namespace Tests\States;

use App\Events\Skills\SkillPublicationMoved;
use App\Hooks\Enums\AnswerType;
use App\Models\Skills\SkillPublication;
use App\Skills\Enums\PublicationStatus;
use App\Stacks\AwaitSkillsState;
use App\Stacks\Support\AwaitSkillsStateReference;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsState;
use Tests\Support\Seeding\SessionHooks;
use Tests\Support\Seeding\StateHandle;
use Tests\Support\Seeding\StateObservation;
use Tests\TestCase;

/**
 * A session whose new skill set waits, on the real engine: it holds its file changes and shell writes with a reason
 * that names skill:status, lets reads through, and ends once its publication settles; another publication moving
 * leaves it holding.
 */
#[TestsState(AwaitSkillsState::class)]
final class AwaitSkillsStateTest extends TestCase
{
    use CommitsHookRows;

    /**
     * Facts reach a stack once its change commits, so these tests commit and empty what they wrote.
     */
    private const array TABLES = ['agent_stacks', 'command_receipts'];

    private const string PUBLICATION = 'publication-1';

    private const string STATUS_COMMAND = 'skill:status';

    private SessionHooks $hooks;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('Writer');
        $this->hooks = $this->journal->hooksFor($this->journal->sessionOf('Writer'));
    }

    /**
     * @return iterable<string, array{PublicationStatus}>
     */
    public static function waitingStates(): iterable
    {
        yield 'pending' => [PublicationStatus::Pending];

        yield 'preparing' => [PublicationStatus::Preparing];

        yield 'failed' => [PublicationStatus::Failed];
    }

    /**
     * @return iterable<string, array{PublicationStatus}>
     */
    public static function settledStates(): iterable
    {
        yield 'delivered' => [PublicationStatus::Delivered];

        yield 'superseded' => [PublicationStatus::Superseded];

        yield 'retired' => [PublicationStatus::Retired];
    }

    #[DataProvider('waitingStates')]
    public function test_a_file_change_or_a_shell_write_is_held_with_the_reason_while_the_set_waits(
        PublicationStatus $status,
    ): void {
        $this->awaiting()
            ->given($this->moved(self::PUBLICATION, $status), fn (StateObservation $state) => $state->assertLive())
            ->given($this->hooks->fileEdit('app/Thing.php'), function (StateObservation $state) {
                $state->assertStateAnswer(AnswerType::Deny);
                $state->assertRefusedWith(self::STATUS_COMMAND);
            })
            ->given(
                $this->hooks->shell('journal run tests --write'),
                fn (StateObservation $state) => $state->assertStateAnswer(AnswerType::Deny),
            );
    }

    public function test_a_held_session_can_still_read(): void
    {
        $this->awaiting()->given(
            $this->hooks->shell('git status'),
            fn (StateObservation $state) => $state->assertStateAnswer(AnswerType::Delegate),
        );
    }

    #[DataProvider('settledStates')]
    public function test_its_publication_settling_ends_the_hold(PublicationStatus $status): void
    {
        $this->awaiting()->given(
            $this->moved(self::PUBLICATION, $status),
            fn (StateObservation $state) => $state->assertFinished(),
        );
    }

    public function test_another_publication_settling_leaves_the_hold(): void
    {
        $this->awaiting()->given(
            $this->moved('publication-2', PublicationStatus::Delivered),
            fn (StateObservation $state) => $state->assertLive(),
        );
    }

    /**
     * The state of a pending publication held in memory only: it keeps what it needs of it in its own values.
     */
    private function awaiting(): StateHandle
    {
        $publication = new SkillPublication();
        $publication->id = self::PUBLICATION;
        $publication->status = PublicationStatus::Pending;

        return $this->journal->pushState(
            $this->journal->sessionOf('Writer'),
            AwaitSkillsStateReference::forPublication($publication),
        );
    }

    private function moved(string $publicationId, PublicationStatus $status): SkillPublicationMoved
    {
        return new SkillPublicationMoved($publicationId, $this->journal->sessionOf('Writer')->id, $status);
    }
}
