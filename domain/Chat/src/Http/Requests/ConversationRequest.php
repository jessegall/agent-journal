<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Requests;

use App\Drivers\Enums\HookDriver;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * The chat window's own query: the agent it talks to, when one is chosen, where the dock's next page starts and the
 * question a notification opened.
 */
final class ConversationRequest extends FormRequest
{
    /**
     * @return array<string, list<string|Enum>>
     */
    public function rules(): array
    {
        return [
            'agent' => ['nullable', 'string', 'ulid'],
            'inbox' => ['nullable', 'string', 'ulid'],
            'dock' => ['nullable', 'string', 'max:2048'],
            'accountsFor' => ['nullable', Rule::enum(HookDriver::class)],
            'question' => ['nullable', 'string', 'ulid'],
        ];
    }

    /**
     * The driver whose eligible accounts a start or switch form asked for, none or one.
     *
     * @return list<HookDriver>
     */
    public function accountDrivers(): array
    {
        return $this->filled('accountsFor') ? [$this->enum('accountsFor', HookDriver::class)] : [];
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
        return $this->filled('inbox') ? Some::create($this->string('inbox')->lower()->toString()) : None::create();
    }

    /**
     * The token of the dock's next page, when the user asked for more.
     */
    public function dockToken(): string|null
    {
        return $this->filled('dock') ? $this->string('dock')->toString() : null;
    }

    /**
     * @return Option<string>
     */
    public function chosenAgent(): Option
    {
        return $this->filled('agent') ? Some::create($this->string('agent')->lower()->toString()) : None::create();
    }

    /**
     * The id of the one question a notification opened, when the query names one.
     *
     * @return Option<string>
     */
    public function focusedQuestionId(): Option
    {
        return $this->filled('question')
            ? Some::create($this->string('question')->lower()->toString())
            : None::create();
    }
}
