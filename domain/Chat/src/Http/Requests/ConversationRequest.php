<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Requests;

use App\Drivers\Enums\HookDriver;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * The chat window's own query: the agent it talks to, when one is chosen, and where the dock's next page starts.
 */
final class ConversationRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'agent' => ['nullable', 'string', 'ulid'],
            'dock' => ['nullable', 'string', 'max:2048'],
            'accountsFor' => ['nullable', Rule::enum(HookDriver::class)],
        ];
    }

    /**
     * The driver whose eligible accounts a start or switch form asked for, none or one.
     *
     * @return list<HookDriver>
     */
    public function askedAccountsDriver(): array
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
