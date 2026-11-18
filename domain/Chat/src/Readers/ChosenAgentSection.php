<?php

declare(strict_types=1);

namespace Domain\Chat\Readers;

use App\Agents\Contracts\SessionReader;
use App\Agents\Support\SessionOption;
use App\Ui\Contracts\SectionReader;
use App\Ui\Declarations\SlotContext;
use Domain\Chat\Data\ChosenAgentData;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * The name of the agent whose session the chat talks to, in Home's bar; a session the user may not talk to now
 * names no agent.
 */
final readonly class ChosenAgentSection implements SectionReader
{
    public function __construct(private SessionReader $sessions) {}

    public function read(SlotContext $context): ChosenAgentData
    {
        $chosen = array_values(array_filter($this->sessions->active(), fn (SessionOption $session) => (string) $session->sessionId === $context->id));

        return $chosen === [] ? throw new NotFoundHttpException() : ChosenAgentData::from(['label' => $chosen[0]->agentName]);
    }
}
