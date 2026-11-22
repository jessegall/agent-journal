<?php

declare(strict_types=1);

namespace App\Ui\Contracts;

use App\Ui\Data\DraftedRecordData;
use App\Ui\Data\DraftQuestionData;

/**
 * The drafting of one noun's record from a few answers, such as a task or a plan: its questions with suggested
 * answers, and the editable fields and drafting agent it makes from the answers. It saves nothing.
 */
interface DraftProducer
{
    /**
     * @return list<DraftQuestionData>
     */
    public function questions(): array;

    /**
     * @param  list<string>  $answers  one answer to each question, in order
     */
    public function draft(array $answers): DraftedRecordData;
}
