<?php

declare(strict_types=1);

namespace Domain\Comments\Http\Requests;

use App\Messages\Commands\SendMessage\SendMessageCommand;
use App\Models\Projects\ProjectRead;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Tells an agent about a comment just left on lines of a project file: the message names the file, the lines and the
 * comment, sent into the agent's inbox, and the request's Idempotency-Key makes a retry the same message.
 */
final class TellFileCommentRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'agent' => ['required', 'string', 'ulid'],
            'path' => ['required', 'string', 'max:'.ProjectRead::PATH_CHARACTER_LIMIT],
            'first_line' => ['required', 'integer', 'min:1'],
            'last_line' => ['required', 'integer', 'gte:first_line'],
            'comment' => ['required', 'string'],
        ];
    }

    public function agentId(): string
    {
        return $this->string('agent')->toString();
    }

    public function command(string $inboxId): SendMessageCommand
    {
        $first = $this->integer('first_line');
        $last = $this->integer('last_line');
        $lines = $first === $last ? "line {$first}" : "lines {$first} to {$last}";
        $path = $this->string('path')->toString();
        $comment = $this->string('comment')->toString();

        return new SendMessageCommand($inboxId, "About {$path}, {$lines}: {$comment}");
    }
}
