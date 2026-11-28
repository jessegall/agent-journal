<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Requests;

use App\Http\Requests\Concerns\ReadsOptionalText;
use Illuminate\Foundation\Http\FormRequest;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * The chat window's own query: the agent it talks to, when one is chosen, the chat, the one agent whose chat a reload
 * reads when it is not the chosen one's, and where the dock's next page starts.
 */
final class ConversationRequest extends FormRequest
{
    use ReadsOptionalText;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'agent' => [
                'nullable',
                'string',
                'ulid',
            ],
            'inbox' => [
                'nullable',
                'string',
                'ulid',
            ],
            'dock' => [
                'nullable',
                'string',
                'max:2048',
            ],
            'read' => [
                'nullable',
                'string',
                'ulid',
            ],
        ];
    }

    /**
     * The query that opens Home with this agent chosen in the chat window.
     *
     * @return array<string, array<string, array<string, string>>>
     */
    public static function queryFor(string $agentId): array
    {
        return ['window' => ['chat.conversation' => ['agent' => $agentId]]];
    }

    /**
     * The query that opens Home with this chat chosen in the chat window, by its inbox, whether or not it has an agent.
     *
     * @return array<string, array<string, array<string, string>>>
     */
    public static function queryForInbox(string $inboxId): array
    {
        return ['window' => ['chat.conversation' => ['inbox' => $inboxId]]];
    }

    /**
     * The chat the query names by its inbox, when it names one.
     *
     * @return Option<string>
     */
    public function chosenInbox(): Option
    {
        $chosen = $this->optionalText('inbox');

        if ($chosen === null) {
            return None::create();
        }

        return new Some(strtolower($chosen));
    }

    /**
     * The token of the dock's next page, when the user asked for more.
     */
    public function dockToken(): string|null
    {
        return $this->optionalText('dock');
    }

    /**
     * The agent whose chat a reload reads, such as a column side by side that is not chosen; the chosen agent's when
     * it names none.
     *
     * @return Option<string>
     */
    public function columnAgent(): Option
    {
        $read = $this->optionalText('read');

        if ($read === null) {
            return None::create();
        }

        return new Some(strtolower($read));
    }

    /**
     * @return Option<string>
     */
    public function chosenAgent(): Option
    {
        $chosen = $this->optionalText('agent');

        if ($chosen === null) {
            return None::create();
        }

        return new Some(strtolower($chosen));
    }
}
