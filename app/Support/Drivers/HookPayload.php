<?php

declare(strict_types=1);

namespace App\Support\Drivers;

use App\Enums\ContextStartType;
use App\Enums\DriverFailure;
use App\Enums\HookEvent;
use App\Enums\SessionEndReason;
use App\Enums\ToolOutcome;
use App\Exceptions\UnreadablePayload;
use App\Support\Inputs\ProtectedFileRead;
use App\Support\Inputs\Values\DriverToolInput;
use App\Support\Inputs\Values\SessionStartDetails;
use PhpOption\Option;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\LaravelData\Optional;

/**
 * The JSON a Claude Code or Codex hook sends on standard input. Fields that belong to some events only are Optional,
 * and reading one that is missing refuses the call by name instead of guessing a value.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class HookPayload extends Data
{
    /**
     * @param  array<string, mixed>|Optional  $toolInput
     * @param  array<string, mixed>|Optional  $toolResponse
     */
    public function __construct(
        public readonly string $hookEventName,
        public readonly string $sessionId,
        public readonly string|Optional $source = new Optional(),
        public readonly string|Optional $prompt = new Optional(),
        public readonly string|Optional $toolName = new Optional(),
        public readonly array|Optional $toolInput = new Optional(),
        public readonly array|string|Optional $toolResponse = new Optional(),
        public readonly bool|Optional $stopHookActive = new Optional(),
        public readonly string|Optional $reason = new Optional(),
        public readonly string|Optional $agentId = new Optional(),
        public readonly string|Optional $promptId = new Optional(),
        public readonly string|Optional $turnId = new Optional(),
        public readonly string|Optional $error = new Optional(),
        public readonly string|Optional $transcriptPath = new Optional(),
        public readonly string|Optional $cwd = new Optional(),
    ) {}

    /**
     * The driver's own id of the prompt this call belongs to: Claude Code's prompt_id, Codex's turn_id (plan 26
     * task 883). Null when the driver sent none; the journal never invents one.
     */
    public function nativePromptId(): string|null
    {
        return match (true) {
            is_string($this->promptId) => $this->promptId,
            is_string($this->turnId) => $this->turnId,
            default => null,
        };
    }

    /**
     * Whether the call comes from inside a driver's own native child, which carries the child's agent id.
     */
    public function isFromNativeChild(): bool
    {
        return is_string($this->agentId) && $this->agentId !== '';
    }

    /**
     * Whether the call is about to run one of the named tools.
     *
     * @param  list<string>  $toolNames
     */
    public function callsAnyOf(array $toolNames): bool
    {
        $isToolCall = $this->event()->map(fn (HookEvent $event) => $event->isToolCall())->getOrElse(false);

        return $isToolCall && is_string($this->toolName) && in_array($this->toolName, $toolNames, true);
    }

    /**
     * The conversation a session start entered: its id, why it started and the transcript file the driver named for
     * it, when it named one.
     */
    public function startDetails(): SessionStartDetails
    {
        $transcriptPath = is_string($this->transcriptPath) ? $this->transcriptPath : null;

        return new SessionStartDetails($this->sessionId, $this->startSource(), $transcriptPath);
    }

    /**
     * The folder the driver works in, against which a tool's relative paths are read; the file system root when the
     * driver named none, so nothing relative is read as safe.
     */
    public function workFolder(): string
    {
        return is_string($this->cwd) ? $this->cwd : '/';
    }

    /**
     * The files a native read, list or search tool names: its file or folder and, for a search, where its pattern
     * starts.
     */
    public function fileRead(): ProtectedFileRead
    {
        $arguments = $this->toolArguments();
        $folder = $this->workFolder();
        $named = $arguments->presentTexts('file_path', 'path');
        $searched = ProtectedFileRead::resolve($folder, $named[0] ?? '.');
        $pattern = $arguments->textArgument('pattern');

        $patternFolder = is_string($pattern) && strcspn($pattern, '*?[{') < strlen($pattern)
            ? [ProtectedFileRead::patternFolder($searched, $pattern)]
            : [];

        return ProtectedFileRead::inFolder($folder, [$searched, ...$patternFolder]);
    }

    public function isSessionStart(): bool
    {
        return $this->event()->map(fn (HookEvent $event) => $event->isSessionStart())->getOrElse(false);
    }

    /**
     * The native event the call was sent for; none for an event the journal maps for no driver.
     *
     * @return Option<HookEvent>
     */
    public function event(): Option
    {
        return Option::fromValue(HookEvent::tryFrom($this->hookEventName));
    }

    /**
     * Why a request failed, from the error code of a failure notification; its error details are never read.
     */
    public function driverFailure(): DriverFailure
    {
        return is_string($this->error) ? DriverFailure::fromCheckedCode($this->error) : DriverFailure::Unknown;
    }

    public function promptText(): string
    {
        return $this->required($this->prompt, 'prompt');
    }

    public function toolNameText(): string
    {
        return $this->required($this->toolName, 'tool_name');
    }

    public function reasonText(): string
    {
        return $this->required($this->reason, 'reason');
    }

    /**
     * Why the session ended, read from the reason both drivers send on SessionEnd.
     */
    public function endReason(): SessionEndReason
    {
        return match ($this->reasonText()) {
            'clear' => SessionEndReason::Clear,
            'logout' => SessionEndReason::Logout,
            'prompt_input_exit' => SessionEndReason::Exit,
            'other' => SessionEndReason::Other,
            default => throw UnreadablePayload::forValue('reason', $this->reasonText()),
        };
    }

    /**
     * Why the context starts, read from the source both drivers send on SessionStart; they call a start startup.
     */
    public function startSource(): ContextStartType
    {
        $source = $this->required($this->source, 'source');

        return match ($source) {
            'startup' => ContextStartType::Start,
            'resume' => ContextStartType::Resume,
            'clear' => ContextStartType::Clear,
            'compact' => ContextStartType::Compact,
            default => throw UnreadablePayload::forValue('source', $source),
        };
    }

    public function isStopContinuation(): bool
    {
        return $this->stopHookActive === true;
    }

    /**
     * @throws UnreadablePayload
     */
    public function toolArguments(): DriverToolInput
    {
        if ($this->toolInput instanceof Optional) {
            throw UnreadablePayload::missing('tool_input');
        }

        return new DriverToolInput($this->toolInput);
    }

    /**
     * The first of the named tool arguments that holds text.
     */
    public function argument(string ...$names): string
    {
        return $this->toolArguments()->firstText(...$names);
    }

    /**
     * Whether the tool failed: Claude Code answers with an object that may say is_error, Codex with the tool's text,
     * which starts with its exit code when the tool reports one.
     */
    public function toolOutcome(): ToolOutcome
    {
        if (is_string($this->toolResponse)) {
            $exitCode = preg_match('/^Exit code: (\d+)/', $this->toolResponse, $match) === 1 ? (int) $match[1] : 0;

            return $exitCode === 0 ? ToolOutcome::Succeeded : ToolOutcome::Failed;
        }

        $response = $this->toolResponse instanceof Optional ? [] : $this->toolResponse;

        return ($response['is_error'] ?? false) === true ? ToolOutcome::Failed : ToolOutcome::Succeeded;
    }

    private function required(string|Optional $hookField, string $field): string
    {
        return $hookField instanceof Optional ? throw UnreadablePayload::missing($field) : $hookField;
    }
}
