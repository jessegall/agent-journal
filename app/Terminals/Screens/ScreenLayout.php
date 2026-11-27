<?php

declare(strict_types=1);

namespace App\Terminals\Screens;

use App\Hosts\Protocol\Payloads\HostFramePayload;
use App\Terminals\Screens\Contracts\ScreenRegion;

/**
 * How one driver build draws its screen, measured from its recordings: the buffer its prompt is on, its composer and
 * the cursor column of an empty one, how long the composer must hold still, its menu families, the other regions
 * worth knowing, how long an unknown screen must hold still, and whether it takes a bracketed paste.
 */
final readonly class ScreenLayout
{
    private const string OPTIONS = 'options';

    /**
     * The region a driver draws while it works, such as Claude Code's spinner line above its composer.
     */
    public const string WORKING = 'spinner';

    /**
     * @param  list<MenuFamily>  $menus
     * @param  list<ScreenRegion>  $others
     */
    public function __construct(
        public string $buffer,
        public ScreenRegion $composer,
        public int $emptyCursorColumn,
        public int $composerStillMs,
        public array $menus,
        public array $others = [],
        public int $unknownStillMs = 500,
        public bool $isBracketedPaste = false,
    ) {}

    /**
     * The rules the host shields the screens of the layout's secret families by, so none of them leaves the machine.
     *
     * @return list<ShieldRule>
     */
    public function shieldRules(): array
    {
        $secret = array_filter($this->menus, fn (MenuFamily $family) => $family->isSecret);

        return array_values(array_map(fn (MenuFamily $family) => $family->shieldRule(), $secret));
    }

    /**
     * Whether the frame draws the driver at work: its working line is shown, whatever the composer looks like, as a
     * driver may keep its composer open while it works.
     */
    public function isWorkingOn(HostFramePayload $frame): bool
    {
        return array_any(
            $this->others,
            fn (ScreenRegion $region) => $region->name() === self::WORKING && $region->rowsOf($frame) !== null,
        );
    }

    /**
     * The lowest list of options any of the layout's highlight markers draws, known menu or not; none when no such
     * list is drawn.
     */
    public function optionsOf(HostFramePayload $frame): RowRange|null
    {
        return $this->optionList()->rowsOf($frame);
    }

    /**
     * The option list drawn with any of the layout's highlight markers, so a menu no family knows is read too.
     */
    public function optionList(): OptionList
    {
        $markers = [];

        foreach ($this->menus as $family) {
            if ($family->options instanceof OptionList) {
                array_push($markers, ...$family->options->markers);
            }
        }

        return new OptionList(self::OPTIONS, array_values(array_unique($markers)));
    }
}
