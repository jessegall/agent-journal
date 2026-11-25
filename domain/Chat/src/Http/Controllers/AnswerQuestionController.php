<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers;

use App\Contracts\Bus\CommandBus;
use Domain\Chat\Data\AnswerInput;
use Domain\Questions\Commands\AnswerQuestion\AnswerQuestionCommand;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Answers the question card the viewer was asked; the command checks the viewer is its target.
 */
final readonly class AnswerQuestionController
{
    public function __invoke(AnswerInput $input, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new AnswerQuestionCommand($input->questionId, $input->answer));

        return $redirect->back(303);
    }
}
