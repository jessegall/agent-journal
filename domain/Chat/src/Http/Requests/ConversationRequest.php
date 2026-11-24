<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Requests;

use App\Contracts\Drivers\DriverCatalogue;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Validation\Rules\In;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * The chat window's own query: the agent it talks to, when one is chosen, the chat, and where the dock's next page
 * starts.
 */
final class ConversationRequest extends FormRequest
{
    /**
     * @return array<string, list<string|Enum|In>>
     */
    public function rules(DriverCatalogue $drivers): array
    {
        return [
            'agent' => ['nullable', 'string', 'ulid'],
            'inbox' => ['nullable', 'string', 'ulid'],
            'dock' => ['nullable', 'string', 'max:2048'],
            'accountsFor' => ['nullable', Rule::in($drivers->familyKeys())],
        ];
    }

    /**
     * The driver whose eligible accounts a start or switch form asked for, none or one.
     *
     * @return list<string>
     */
    public function accountDrivers(): array
    {
        return $this->filled('accountsFor') ? [$this->string('accountsFor')->toString()] : [];
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
}
