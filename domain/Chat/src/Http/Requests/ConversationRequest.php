<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Requests;

use App\Http\Requests\Concerns\ReadsOptionalText;
use Illuminate\Foundation\Http\FormRequest;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * The chat window's own query: the agent it talks to, when one is chosen, the chat, the agents whose chats show beside
 * it, and where the dock's next page starts.
 */
final class ConversationRequest extends FormRequest
{
    use ReadsOptionalText;

    /**
     * The most chats shown beside the chosen one.
     */
    public const int MOST_BESIDE = 3;

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
            'beside' => [
                'nullable',
                'array',
                'max:'.self::MOST_BESIDE,
            ],
            'beside.*' => [
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

        return $chosen === null ? None::create() : new Some(strtolower($chosen));
    }

    /**
     * The token of the dock's next page, when the user asked for more.
     */
    public function dockToken(): string|null
    {
        return $this->optionalText('dock');
    }

    /**
     * The agents whose chats show beside the chosen one, in the order the query names them; none in one-at-a-time view.
     *
     * @return list<string>
     */
    public function besideAgents(): array
    {
        return array_values(array_map(
            fn (string $agentId) => strtolower($agentId),
            $this->collect('beside')->filter(fn (mixed $agentId) => is_string($agentId))->all(),
        ));
    }

    /**
     * @return Option<string>
     */
    public function chosenAgent(): Option
    {
        $chosen = $this->optionalText('agent');

        return $chosen === null ? None::create() : new Some(strtolower($chosen));
    }
}
