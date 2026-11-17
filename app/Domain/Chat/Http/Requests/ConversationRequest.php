<?php

declare(strict_types=1);

namespace App\Domain\Chat\Http\Requests;

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
        return ['session' => ['nullable', 'string', 'regex:/^[1-9][0-9]{0,18}$/']];
    }

    /**
     * @return Option<int>
     */
    public function chosenSession(): Option
    {
        return $this->filled('session') ? Some::create($this->integer('session')) : None::create();
    }
}
