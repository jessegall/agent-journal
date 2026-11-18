<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * The chat window's own query: the agent session it talks to, as a decimal string, when one is chosen.
 */
final class ConversationRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return ['session' => ['nullable', 'string', 'ulid']];
    }

    /**
     * @return Option<string>
     */
    public function chosenSession(): Option
    {
        return $this->filled('session') ? Some::create($this->string('session')->lower()->toString()) : None::create();
    }
}
