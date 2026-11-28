<?php

declare(strict_types=1);

namespace App\Recordings;

use App\Hosts\InstructionSignature;
use App\Hosts\Protocol\Payloads\HostClaimedInstructionsPayload;
use App\Hosts\Protocol\Payloads\HostInstructionPayload;
use App\Recordings\Enums\Wire;
use App\Recordings\Exceptions\RecordedEnvironmentRefused;
use App\Recordings\Exceptions\RecordingLeaks;
use App\Recordings\Exceptions\RecordingOutsideContainer;

/**
 * Puts fakes in place of a recorded run's real values on every wire, one fake to a value through the run and the same
 * on a re-record, refuses what must never be recorded, and signs the faked instructions anew.
 */
final class RecordingFakes
{
    public const string EMAIL = 'user@example.com';

    public const string TOKEN = 'fake-token';

    public const string JSON_WEB_TOKEN = 'eyJmYWtlIjoidG9rZW4ifQ.ZmFrZQ.ZmFrZQ';

    public const string ORGANIZATION = 'Example Organization';

    public const string USER_NAME = 'Example User';

    public const string USER_FOLDER = '/home/user';

    public const string SECRET = 'fake-secret';

    /**
     * The instruction secret the faked instructions are signed with, which a Go test signs its instructions with too.
     */
    public const string INSTRUCTION_SECRET = 'recorded-instruction-secret';

    /**
     * The shortest folder of the environment put back as {env:NAME}, so a short value such as / is never.
     */
    private const int SHORTEST_FOLDER = 4;

    /**
     * The start of every fake uuid, which is kept as it is, so a recording made from a mock's answer stays the same.
     */
    private const string FAKE_UUID_PREFIX = '00000000-0000-4000-8000-';

    private const string UUID = '/\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b/';

    /**
     * The journal's ids: a ulid in lower case, as the journal writes them.
     */
    private const string ULID = '/\b0[0-7][0-9a-hjkmnp-tv-z]{24}\b/';

    /**
     * The start of every fake ulid, which is kept as it is.
     */
    private const string FAKE_ULID_PREFIX = '00000000000000';

    private const string DIGEST = '/\b[0-9a-f]{64}\b/';

    /**
     * The start of every fake digest, which is kept as it is.
     */
    private const string FAKE_DIGEST_PREFIX = '0000000000000000';

    /**
     * A variable that holds a secret, by its name, in NAME=value form.
     */
    private const string SECRET_VARIABLE = '/((?:TOKEN|SECRET|PASSWORD|GRANT|KEY)[A-Z_]*=)[^"\\\\\s]+/';

    /**
     * The variables of the recording user's own terminal and Claude Code session, which no recorded exchange may hold.
     */
    private const string REFUSED_VARIABLES = '/^(ITERM_|TERM_PROGRAM|TERM_SESSION_ID|CLAUDECODE$'
        .'|CLAUDE_CODE_ENTRYPOINT$|CLAUDE_CODE_SSE_PORT$)/';

    /**
     * The shortest known value looked for in a faked recording, so a short value such as 1 is never taken for a leak.
     */
    private const int SHORTEST_KNOWN_VALUE = 6;

    private const string ACCOUNT_ID = '/\b(user|org|acct|account)-[A-Za-z0-9]{12,}\b/';

    /**
     * The real value of each uuid and account id seen, by its fake.
     *
     * @var array<string, string>
     */
    private array $fakes = [];

    /**
     * @param  array<string, string>  $environment  the recorded process's variables, by name
     * @param  list<string>  $personalValues  the names, emails and account details of this journal's people
     */
    public function __construct(private readonly array $environment, private readonly array $personalValues) {}

    /**
     * Each fake a recording holds, as a pattern of its fake, with the pattern of the real value it stands for.
     *
     * @return array<string, string>
     */
    public static function fakeShapes(): array
    {
        return [
            '/'.self::FAKE_UUID_PREFIX.'[0-9a-f]{12}/' => self::UUID,
            '/'.self::FAKE_ULID_PREFIX.'[0-9a-hjkmnp-tv-z]{12}/' => self::ULID,
            '/'.self::FAKE_DIGEST_PREFIX.'[0-9a-f]{48}/' => self::DIGEST,
        ];
    }

    public function replaceIn(string $text): string
    {
        $faked = strtr($text, $this->environmentFolders());
        $faked = strtr($faked, array_fill_keys($this->distinctivePersonalValues(), self::USER_NAME));

        $faked = (string) preg_replace(
            [
                '#/(?:Users|home)/(?!user\b)[^/\s"\'\\\\]+#',
                '#\\\\/(?:Users|home)\\\\/(?!user\b)[^/\s"\'\\\\]+#',
                '#-(?:Users|home)-(?!user-)[A-Za-z0-9._]+-#',
            ],
            [self::USER_FOLDER, str_replace('/', '\\/', self::USER_FOLDER), '-home-user-'],
            $faked,
        );

        $faked = (string) preg_replace('/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/', self::EMAIL, $faked);

        $faked = (string) preg_replace(
            ['/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/', '/\bsk-(?:ant-)?[A-Za-z0-9_-]{16,}/'],
            [self::JSON_WEB_TOKEN, 'sk-'.self::TOKEN],
            $faked,
        );

        $faked = $this->replaceNamedValues($faked);
        $faked = (string) preg_replace(self::SECRET_VARIABLE, '${1}'.self::SECRET, $faked);

        $faked = (string) preg_replace_callback(
            self::ACCOUNT_ID,
            fn (array $found) => $this->fakeOf($found[0], $found[1]),
            $faked,
        );

        $faked = (string) preg_replace_callback(self::UUID, fn (array $found) => $this->fakeOf($found[0], ''), $faked);
        $faked = (string) preg_replace_callback(self::ULID, fn (array $found) => $this->ulidFakeOf($found[0]), $faked);

        $fakeDigest = fn (array $found) => $this->digestFakeOf($found[0]);

        return (string) preg_replace_callback(self::DIGEST, $fakeDigest, $faked);
    }

    /**
     * Refuses an exchange that carries a variable of the recording user's own session, or a driver's exchange that
     * ran anywhere but in one of the images: the agent image or a driver image a host built and checked.
     *
     * @param  list<string>  $images
     *
     * @throws RecordedEnvironmentRefused
     * @throws RecordingOutsideContainer
     */
    public function assertClean(RecordingOpening $opening, array $images): void
    {
        $refused = array_values(array_filter(
            $opening->environmentNames(),
            fn (string $name) => preg_match(self::REFUSED_VARIABLES, $name) === 1,
        ));

        if ($refused !== []) {
            throw RecordedEnvironmentRefused::naming($refused);
        }

        if ($opening->wire === Wire::Driver && ! in_array($opening->image, $images, true)) {
            throw RecordingOutsideContainer::of($opening->exchange, $opening->image);
        }
    }

    /**
     * Refuses a faked recording that still holds any of the run's real values, naming only their places.
     *
     * @param  list<string>  $knownValues
     *
     * @throws RecordingLeaks
     */
    public function assertNoLeak(string $encoded, array $knownValues): void
    {
        $leaked = array_keys(array_filter(
            $knownValues,
            fn (string $value) => strlen($value) >= self::SHORTEST_KNOWN_VALUE && str_contains($encoded, $value),
        ));

        if ($leaked !== []) {
            throw RecordingLeaks::at($leaked);
        }
    }

    /**
     * The instructions of a faked claim answer, each signed again with INSTRUCTION_SECRET, since faking changed what was signed.
     */
    public function resignedClaim(HostClaimedInstructionsPayload $claim): HostClaimedInstructionsPayload
    {
        $instructions = array_map(fn (HostInstructionPayload $instruction) => HostInstructionPayload::from([
            ...$instruction->toArray(),
            'signature' => InstructionSignature::of(
                $instruction->id,
                $instruction->sequence,
                $instruction->type,
                $instruction->processId,
                $instruction->payload,
                $instruction->expiresAt,
                self::INSTRUCTION_SECRET,
            ),
        ]), $claim->instructions);

        return HostClaimedInstructionsPayload::from([...$claim->toArray(), 'instructions' => $instructions]);
    }

    /**
     * The personal values long enough to stand for themselves, longest first so a longer one is faked whole.
     *
     * @return list<string>
     */
    private function distinctivePersonalValues(): array
    {
        $values = array_values(array_filter(
            array_unique($this->personalValues),
            fn (string $value) => strlen($value) >= self::SHORTEST_KNOWN_VALUE,
        ));
        usort($values, fn (string $left, string $right) => strlen($right) <=> strlen($left));

        return $values;
    }

    /**
     * Each folder the environment names, by its path as printed and as JSON escapes it, put back as the variable that
     * names it; strtr replaces the longest path first.
     *
     * @return array<string, string>
     */
    private function environmentFolders(): array
    {
        $folders = array_filter(
            $this->environment,
            fn (string $value) => str_starts_with($value, '/') && strlen($value) >= self::SHORTEST_FOLDER
                && ! str_contains($value, ':'),
        );

        $named = array_map(fn (string $name) => "{env:{$name}}", array_flip($folders));

        $escaped = array_combine(
            array_map(fn (string $folder) => str_replace('/', '\\/', $folder), array_keys($named)),
            $named,
        );

        return [
            ...$named,
            ...$escaped,
        ];
    }

    /**
     * The tokens, names and organizations a program prints or is handed under their JSON keys, such as the start grant
     * of a thread's config, and an organization a screen names.
     */
    private function replaceNamedValues(string $text): string
    {
        $named = (string) preg_replace(
            '/("(?:access_?token|refresh_?token|id_?token|api_?key|accessToken|refreshToken|idToken|apiKey|token'
                .'|journal_start_token)'
                .'\\\\?"\s*:\s*\\\\?")[^"\\\\]+/i',
            '${1}'.self::TOKEN,
            $text,
        );

        $named = (string) preg_replace(
            '/("(?:orgName|organizationName|organization_name)\\\\?"\s*:\s*\\\\?")[^"\\\\]+/',
            '${1}'.self::ORGANIZATION,
            $named,
        );

        $named = (string) preg_replace(
            '/("(?:displayName|fullName|userName|display_name|full_name)\\\\?"\s*:\s*\\\\?")[^"\\\\]+/',
            '${1}'.self::USER_NAME,
            $named,
        );

        return (string) preg_replace("/[^\\s\"'│]+(?:'s|’s) (Organization|Workspace)/u", 'Example\'s $1', $named);
    }

    private function ulidFakeOf(string $real): string
    {
        if (str_starts_with($real, self::FAKE_ULID_PREFIX)) {
            return $real;
        }

        return $this->numberedFakeOf($real, '%026d');
    }

    private function digestFakeOf(string $real): string
    {
        if (str_starts_with($real, self::FAKE_DIGEST_PREFIX)) {
            return $real;
        }

        return $this->numberedFakeOf($real, '%064d');
    }

    /**
     * The fake a real value gets from the format, numbered in the order the values are seen, the same each time.
     */
    private function numberedFakeOf(string $real, string $format): string
    {
        $known = array_search($real, $this->fakes, true);

        if (is_string($known)) {
            return $known;
        }

        $fake = sprintf($format, count($this->fakes) + 1);
        $this->fakes[$fake] = $real;

        return $fake;
    }

    /**
     * The fake a real uuid or account id gets, the same each time it is seen.
     */
    private function fakeOf(string $real, string $prefix): string
    {
        if (str_starts_with($real, self::FAKE_UUID_PREFIX)) {
            return $real;
        }

        $known = array_search($real, $this->fakes, true);

        if (is_string($known)) {
            return $known;
        }

        $number = count($this->fakes) + 1;

        $fake = $prefix === ''
            ? sprintf('%s%012d', self::FAKE_UUID_PREFIX, $number)
            : sprintf('%s-%016d', $prefix, $number);

        $this->fakes[$fake] = $real;

        return $fake;
    }
}
