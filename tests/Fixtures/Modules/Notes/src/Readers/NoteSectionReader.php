<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Readers;

use App\Agents\Contracts\SessionReader;
use App\Ui\Contracts\SectionReader;
use App\Ui\Declarations\SlotContext;
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
        $this->sessions->requireActive((string) $context->id);

        return NoteSectionData::from(['count' => Note::query()->forActor()->count()]);
    }
}
