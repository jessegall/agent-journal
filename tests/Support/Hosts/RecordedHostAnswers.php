<?php

declare(strict_types=1);

namespace Tests\Support\Hosts;

use App\Hosts\Protocol\HostInstructionType;
use App\Hosts\Protocol\HostRoute;
use App\Hosts\Protocol\Payloads\HostClaimedInstructionsPayload;
use App\Support\Recordings\Enums\Wire;
use App\Support\Recordings\Recordings;
use PHPUnit\Framework\Assert;

/**
 * The answers a recorded host gave the journal's orders in one scenario, the first it carried out of each order type,
 * as the host wrote them: a mock host answers with these, never with an answer of its own.
 */
final readonly class RecordedHostAnswers
{
    /**
     * The pattern of an answer's path, with the order it answers.
     */
    private const string ANSWER_PATH = '#^/host/instructions/([^/]+)$#';

    /**
     * @param  array<string, array{status: string, facts: array<string, mixed>}>  $answers  by order type
     */
    private function __construct(private string $driver, private array $answers) {}

    /**
     * The pinned terminal turn's protocol answers, independently of the screens the mock plays.
     */
    public static function terminalTurn(Recordings $recordings, string $driver): self
    {
        $types = [];
        $answers = [];

        foreach ($recordings->scenario($driver, 'terminal-turn')->calls(Wire::Host) as $call) {
            if ($call->status !== null && HostRoute::ClaimInstruction->matchesPath($call->path)) {
                foreach (HostClaimedInstructionsPayload::from($call->body)->instructions as $instruction) {
                    $types[$instruction->id] = $instruction->type;
                }
            }

            if ($call->status !== null || preg_match(self::ANSWER_PATH, $call->path, $answered) !== 1) {
                continue;
            }

            $answer = (array) json_decode($call->body, true);

            if (($answer['status'] ?? '') === 'done' && isset($types[$answered[1]])) {
                $answers[$types[$answered[1]]] ??= ['status' => 'done', 'facts' => (array) ($answer['facts'] ?? [])];
            }
        }

        return new self($driver, $answers);
    }

    /**
     * The recorded answer to an order of the type; a type the recording never answered fails the test by name.
     *
     * @return array{status: string, facts: array<string, mixed>}
     */
    public function to(HostInstructionType $type): array
    {
        return $this->answers[$type->value]
            ?? Assert::fail("The {$this->driver} terminal turn holds no answer to a {$type->value} order.");
    }
}
