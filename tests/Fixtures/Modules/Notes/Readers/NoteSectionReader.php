<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Readers;

use App\Core\Agents\Contracts\SessionReader;
use App\Domain\Contracts\SectionReader;
use App\Domain\Declarations\SlotContext;
use Tests\Fixtures\Modules\Notes\Data\NoteSectionData;
use Tests\Fixtures\Modules\Notes\Models\Note;

/**
 * How many notes the calling actor has, in Chat's dock; the chosen session is checked again through Core.
 */
final readonly class NoteSectionReader implements SectionReader
{
    public function __construct(private SessionReader $sessions) {}

    public function read(SlotContext $context): NoteSectionData
    {
        $this->sessions->requireActive((int) $context->id);

        return NoteSectionData::from(['count' => Note::query()->forActor()->count()]);
    }
}
