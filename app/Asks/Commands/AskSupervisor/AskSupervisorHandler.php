<?php

declare(strict_types=1);

namespace App\Asks\Commands\AskSupervisor;

use App\Asks\AskService;
use App\Asks\AskTypeRegistry;
use App\Asks\Commands\RouteAsk\RouteAskCommand;
use App\Asks\Enums\AskOriginType;
use App\Asks\Exceptions\AskRefused;
use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\CommandHandler;
use App\Models\Asks\Ask;
use App\Models\Asks\AskRequester;
use App\Stacks\Contracts\Work\AgentFocuses;
use App\Values\AskReference;

final readonly class AskSupervisorHandler implements CommandHandler
{
    private const int OPEN_LIMIT = 5;

    public function __construct(
        private AgentFocuses $focuses,
        private AskTypeRegistry $types,
        private AskService $opening,
        private CommandBus $commands,
    ) {}

    public function handle(AskSupervisorCommand $command): AskReference
    {
        $requester = $command->dispatchedBy();
        $body = trim($command->body);
        AskRefused::assertValidSubmission($body, $command->submissionKey);
        AskRequester::create($requester);

        $type = $this->types->get($command->typeKey());
        $retained = Ask::findSubmission($requester, $command->submissionKey);

        if ($retained->isDefined()) {
            return $retained->get()->replay($type->key(), $body);
        }

        if (Ask::resolveOpenSubmissions($requester) >= self::OPEN_LIMIT) {
            throw AskRefused::openLimit(self::OPEN_LIMIT);
        }

        $work = $this->focuses->focusOf($requester)->getOrElse(null);

        $ask = $this->opening->open(
            $requester,
            $type,
            $command->submissionKey,
            $body,
            $work,
            AskOriginType::Supervisor,
        );

        $this->commands->run(new RouteAskCommand($ask->reference, 0));

        return $ask->reference;
    }
}
