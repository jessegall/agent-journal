<?php

declare(strict_types=1);

namespace App\Terminals\Screens;

use App\Agents\Drivers\Enums\HoldReason;
use App\Hosts\Protocol\Payloads\HostFramePayload;
use App\Terminals\Screens\Contracts\ScreenRegion;

/**
 * One kind of menu a driver puts up, known by shape and words rather than exact text: its options are found by their
 * shape, and enough of its keywords must appear on the screen, in any case and order, so a reworded menu still
 * matches. It holds the runtime for its reason, unless it is answered with recorded keys.
 */
final readonly class MenuFamily
{
    private const int FEWEST_KEYWORDS = 2;

    private const int STILL_MS = 300;

    /**
     * @param  list<string>  $keywords
     */
    private function __construct(
        public string $name,
        public HoldReason $hold,
        public ScreenRegion $options,
        public array $keywords,
        public int $stillMs,
        public string|null $answer,
        public bool $isSecret,
    ) {}

    public static function of(string $name, HoldReason $hold, ScreenRegion $options, string ...$keywords): self
    {
        return new self($name, $hold, $options, array_values($keywords), self::STILL_MS, null, false);
    }

    /**
     * The family whose highlighted entry is harmless and is accepted with the recorded keys, so its screen is passed
     * instead of holding the runtime.
     */
    public function answeredWith(string $keys): self
    {
        return clone ($this, ['answer' => $keys]);
    }

    /**
     * The family whose screen asks for a key, a password or another secret.
     */
    public function secret(): self
    {
        return clone ($this, ['isSecret' => true]);
    }

    /**
     * The rule the host shields this family's screen by, its keywords as the family knows them.
     */
    public function shieldRule(): ShieldRule
    {
        return new ShieldRule($this->keywords, self::FEWEST_KEYWORDS);
    }

    /**
     * Whether the frame shows this family: its options are drawn and enough of its keywords appear.
     */
    public function isShownOn(HostFramePayload $frame): bool
    {
        if ($this->options->rowsOf($frame) === null) {
            return false;
        }

        $text = mb_strtolower(implode("\n", $frame->rows));
        $present = array_filter($this->keywords, fn (string $keyword) => str_contains($text, mb_strtolower($keyword)));

        return count($present) >= self::FEWEST_KEYWORDS;
    }
}
