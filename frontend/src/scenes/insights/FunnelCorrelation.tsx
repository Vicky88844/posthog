import { Button, Card, Row, Col } from 'antd'
import { CommentOutlined } from '@ant-design/icons'
import TextArea from 'antd/lib/input/TextArea'
import { useActions, useValues } from 'kea'
import React from 'react'
import { funnelLogic } from 'scenes/funnels/funnelLogic'
import { insightLogic } from './insightLogic'
import './FunnelCorrelation.scss'
import { FunnelCorrelationTable } from './InsightTabs/FunnelTab/FunnelCorrelationTable'
import { FunnelPropertyCorrelationTable } from './InsightTabs/FunnelTab/FunnelPropertyCorrelationTable'
import { IconFeedbackWarning } from 'lib/components/icons'
import { CloseOutlined } from '@ant-design/icons'

export const FunnelCorrelation = (): JSX.Element | null => {
    const { insightProps } = useValues(insightLogic)
    const {
        isSkewed,
        stepsWithCount,
        correlationFeedbackHidden,
        correlationDetailedFeedbackVisible,
        correlationFeedbackRating,
    } = useValues(funnelLogic(insightProps))
    const {
        sendCorrelationAnalysisFeedback,
        hideSkewWarning,
        hideCorrelationAnalysisFeedback,
        setCorrelationFeedbackRating,
        setCorrelationDetailedFeedback,
    } = useActions(funnelLogic(insightProps))

    if (stepsWithCount.length <= 1) {
        return null
    }

    return (
        <div className="funnel-correlation">
            {isSkewed && (
                <Card className="skew-warning">
                    <h4>
                        <IconFeedbackWarning style={{ fontSize: 24, marginRight: 4, color: 'var(--warning)' }} /> Adjust
                        your funnel definition to improve correlation analysis
                        <CloseOutlined className="close-button" onClick={hideSkewWarning} />
                    </h4>
                    <div>
                        <b>Tips for adjusting your funnel:</b>
                        <ol>
                            <li>
                                Adjust your first funnel step to be more specific. For example, choose a page or an
                                event that occurs less frequently.
                            </li>
                            <li>Choose an event that happens more frequently for subsequent funnels steps.</li>
                        </ol>
                    </div>
                </Card>
            )}

            {/* Feedback Form */}
            {!correlationFeedbackHidden && (
                <Card className="correlation-feedback">
                    <h4>
                        <CloseOutlined className="close-button" onClick={hideCorrelationAnalysisFeedback} />
                        <Row>
                            <Col span={16}>
                                <CommentOutlined style={{ paddingRight: 8 }} />
                                Is the new feature, Corrrelation analysis, working well for you?
                            </Col>
                            <Col span={8} style={{ alignContent: 'right' }}>
                                {(
                                    [
                                        [1, '😍'],
                                        [2, '😀'],
                                        [3, '😴'],
                                        [4, '👎'],
                                        [5, '👍'],
                                    ] as const
                                ).map((content, index) => (
                                    <Button
                                        key={index}
                                        className="emoji-button"
                                        style={
                                            correlationFeedbackRating === content[0] ? { background: '#5375FF' } : {}
                                        }
                                        onClick={() => {
                                            setCorrelationFeedbackRating(content[0])
                                        }}
                                    >
                                        {content[1]}
                                    </Button>
                                ))}
                            </Col>
                        </Row>
                    </h4>
                    <div style={{ display: correlationDetailedFeedbackVisible ? undefined : 'None' }}>
                        <hr />
                        Tell us more <i>(optional)</i>
                        <TextArea onBlur={(e) => setCorrelationDetailedFeedback(e.target.value)} />
                        <Row style={{ justifyContent: 'flex-end' }}>
                            <Button
                                className="feedback-button"
                                onClick={() => {
                                    setCorrelationFeedbackRating(0)
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="feedback-button"
                                type="primary"
                                onClick={() => {
                                    sendCorrelationAnalysisFeedback()
                                }}
                            >
                                Share Feedback
                            </Button>
                        </Row>
                    </div>
                </Card>
            )}

            <FunnelCorrelationTable />
            <FunnelPropertyCorrelationTable />
        </div>
    )
}
