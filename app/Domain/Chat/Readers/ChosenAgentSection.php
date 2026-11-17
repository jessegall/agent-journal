<?php

declare(strict_types=1);

namespace App\Domain\Chat\Readers;

use App\Core\Agents\Contracts\SessionReader;
use App\Core\Agents\Support\SessionOption;
use App\Core\Ui\Contracts\SectionReader;
use App\Core\Ui\Declarations\SlotContext;
use App\Domain\Chat\Data\ChosenAgentData;
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

        return $chosen === [] ? throw new NotFoundHttpException : ChosenAgentData::from(['label' => $chosen[0]->agentName]);
    }
}
