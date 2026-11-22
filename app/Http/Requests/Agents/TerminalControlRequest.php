<?php

declare(strict_types=1);

namespace App\Http\Requests\Agents;

use App\Commands\CancelPrivateEntry\CancelPrivateEntryCommand;
use App\Commands\CancelTerminalTake\CancelTerminalTakeCommand;
use App\Commands\CheckTerminalScreen\CheckTerminalScreenCommand;
use App\Commands\ChooseTerminalDraft\ChooseTerminalDraftCommand;
use App\Commands\OpenPrivateEntry\OpenPrivateEntryCommand;
use App\Commands\ReleaseTerminalControl\ReleaseTerminalControlCommand;
use App\Commands\RenewTerminalControl\RenewTerminalControlCommand;
use App\Commands\SendTerminalInput\SendTerminalInputCommand;
use App\Commands\SubmitPrivateInput\SubmitPrivateInputCommand;
use App\Commands\TakeTerminalControl\TakeTerminalControlCommand;
use App\Enums\TerminalDraftChoice;
use App\Enums\TerminalInputType;
use App\Enums\TerminalNamedKey;
use App\Support\TerminalInput;
use App\Values\PrivateSubmission;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * A browser writer's control action on the agent's terminal named in the route: a take through their read interest,
 * a cancel by its take id, or a renewal, give back, input, draft choice, screen check or receipt through the grant id
 * their tab holds. Typed text is a field of its own and is never logged.
 */
final class TerminalControlRequest extends FormRequest
{
    /**
     * The most characters one input may carry, the outstanding bound of one view; a paste has its own smaller bound.
     */
    public const int TEXT_LIMIT = 65_536;

    /**
     * The most characters a private value may carry.
     */
    public const int PRIVATE_VALUE_LIMIT = 4_096;

    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'interest' => ['sometimes', 'string', 'max:64'],
            'takeId' => ['sometimes', 'string', 'max:64'],
            'grantId' => ['sometimes', 'string', 'max:64'],
            'text' => ['sometimes', 'string', 'max:'.self::TEXT_LIMIT],
            'enter' => ['sometimes', 'boolean'],
            'type' => ['sometimes', Rule::enum(TerminalInputType::class)],
            'key' => ['required_if:type,key', Rule::enum(TerminalNamedKey::class)],
            'rows' => ['required_if:type,resize', 'integer', 'min:1', 'max:1000'],
            'columns' => ['required_if:type,resize', 'integer', 'min:1', 'max:1000'],
            'sequence' => ['sometimes', 'integer', 'min:1'],
            'screenRevision' => ['sometimes', 'integer', 'min:0'],
            'choice' => ['sometimes', Rule::enum(TerminalDraftChoice::class)],
            'submissionId' => ['sometimes', 'string', 'max:64'],
            'value' => ['sometimes', 'string', 'max:'.self::PRIVATE_VALUE_LIMIT],
            'actor' => ['prohibited'],
            'session' => ['prohibited'],
        ];
    }

    public function takeCommand(): TakeTerminalControlCommand
    {
        return new TakeTerminalControlCommand($this->agentId(), $this->string('interest')->toString(), $this->takeId());
    }

    public function cancelCommand(): CancelTerminalTakeCommand
    {
        return new CancelTerminalTakeCommand($this->agentId(), $this->takeId());
    }

    public function renewCommand(): RenewTerminalControlCommand
    {
        return new RenewTerminalControlCommand($this->agentId(), $this->grantId());
    }

    public function releaseCommand(): ReleaseTerminalControlCommand
    {
        return new ReleaseTerminalControlCommand($this->agentId(), $this->grantId());
    }

    public function inputCommand(): SendTerminalInputCommand
    {
        $input = new TerminalInput(
            $this->string('text')->toString(),
            $this->boolean('enter'),
            $this->sequence(),
            $this->integer('screenRevision'),
            $this->enum('type', TerminalInputType::class) ?? TerminalInputType::Text,
            $this->enum('key', TerminalNamedKey::class),
            $this->integer('rows'),
            $this->integer('columns'),
        );

        return new SendTerminalInputCommand($this->agentId(), $this->grantId(), $input);
    }

    public function chooseCommand(): ChooseTerminalDraftCommand
    {
        $this->validate(['choice' => ['required', Rule::enum(TerminalDraftChoice::class)]]);
        $choice = TerminalDraftChoice::from($this->string('choice')->toString());

        return new ChooseTerminalDraftCommand($this->agentId(), $this->grantId(), $choice, $this->sequence());
    }

    public function openPrivateCommand(): OpenPrivateEntryCommand
    {
        return new OpenPrivateEntryCommand($this->agentId(), $this->grantId(), $this->sequence());
    }

    public function submitPrivateCommand(): SubmitPrivateInputCommand
    {
        $submission = new PrivateSubmission($this->submissionId(), $this->sequence());

        return new SubmitPrivateInputCommand($this->agentId(), $this->grantId(), $submission);
    }

    public function cancelPrivateCommand(): CancelPrivateEntryCommand
    {
        return new CancelPrivateEntryCommand($this->agentId(), $this->grantId());
    }

    public function submissionId(): string
    {
        $this->validate(['submissionId' => ['required', 'string', 'max:64']]);

        return $this->string('submissionId')->toString();
    }

    /**
     * The private value the request carries; it is never logged, flashed or put in a command.
     */
    public function privateValue(): string
    {
        $this->validate(['value' => ['required', 'string', 'max:'.self::PRIVATE_VALUE_LIMIT]]);

        return $this->string('value')->toString();
    }

    public function checkCommand(): CheckTerminalScreenCommand
    {
        return new CheckTerminalScreenCommand($this->agentId(), $this->grantId());
    }

    public function agentId(): string
    {
        return strtolower((string) $this->route('agent'));
    }

    public function takeId(): string
    {
        return $this->string('takeId')->toString();
    }

    public function grantId(): string
    {
        return $this->string('grantId')->toString();
    }

    public function sequence(): int
    {
        return $this->integer('sequence');
    }
}
