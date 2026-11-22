<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Support\ActorIdentity;
use App\Support\StateLoading\Contracts\RecipientStateLoader;
use App\Support\Decisions\StateReferences;
use App\Support\StateLoading\StateSet;
use App\Enums\SessionTransferType;
use App\Support\States\AgentState;
use Closure;

/**
 * A state type for tests that depends on its recipient: it records each recipient it was asked for and builds its
 * states with a closure.
 */
final class RecipientRecordingLoader implements RecipientStateLoader
{
    /**
     * @var list<ActorIdentity|null>
     */
    public array $recipients = [];

    /**
     * @param  class-string<AgentState>  $stateClass
     * @param  Closure(): AgentState  $make
     */
    public function __construct(private readonly string $stateClass, private readonly Closure $make) {}

    public function stateClass(): string
    {
        return $this->stateClass;
    }

    public function statesFor(StateReferences $references): StateSet
    {
        $this->recipients[] = null;

        return StateSet::build($references, fn () => ($this->make)());
    }

    public function statesForRecipient(StateReferences $references, ActorIdentity $recipient): StateSet
    {
        $this->recipients[] = $recipient;

        return StateSet::build($references, fn () => ($this->make)());
    }

    public function schemaVersion(): int
    {
        return 1;
    }

    public function sessionTransfer(): SessionTransferType
    {
        return SessionTransferType::SessionOnly;
    }
}
