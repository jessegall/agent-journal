<?php

declare(strict_types=1);

namespace Domain\Rules\Tests\Fixtures;

use App\Support\ActorContext;
use Domain\Rules\Enums\RuleStatus;
use Domain\Rules\Models\Rule;
use PHPUnit\Framework\Assert;
use Tests\Support\Seeding\FixtureAliases;
use Tests\Support\Seeding\JournalSeed;

/**
 * Project rules kept under the names a test gives them: proposed by a named user or agent, and made to hold by the
 * approval of another, as the journal makes one hold.
 */
final class RuleFixtures
{
    private const string REASON = 'A rule the test needs.';

    private readonly FixtureAliases $aliases;

    public function __construct(private readonly JournalSeed $journal)
    {
        $this->aliases = new FixtureAliases('RuleFixtures');
    }

    public function proposedRule(string $name, string $text, string $proposer, string $reason = self::REASON): self
    {
        $this->aliases->claim($name);
        $proposed = Rule::create($text, $reason, null, ActorContext::of($this->journal->userOrAgentCalled($proposer)));
        $this->aliases->remember($name, $proposed);

        return $this;
    }

    /**
     * A rule the proposer put forward and the approver, another user, approved.
     */
    public function holdingRule(
        string $name,
        string $text,
        string $proposer,
        string $approver,
        string $reason = self::REASON,
    ): self {
        $this->proposedRule($name, $text, $proposer, $reason)->ruleCalled($name)->approveBy(
            $this->journal->actorCalled($approver),
        );

        return $this;
    }

    public function ruleCalled(string $name): Rule
    {
        return $this->aliases->model(Rule::class, $name);
    }

    /**
     * The rule is saved as active and is among the rules that hold.
     */
    public function assertHolds(string $name): self
    {
        $rule = $this->ruleCalled($name);

        Assert::assertSame(RuleStatus::Active, $rule->status, "The rule {$name} does not hold.");
        Assert::assertTrue(
            Rule::query()->active()->whereKey($rule->id)->exists(),
            "The rule {$name} is not among those that hold.",
        );

        return $this;
    }

    public function assertRemoved(string $name): self
    {
        Assert::assertSame(RuleStatus::Removed, $this->ruleCalled($name)->status, "The rule {$name} was not removed.");

        return $this;
    }
}
