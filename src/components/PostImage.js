import React from 'react'
import PropTypes from 'prop-types'

const PostImage = ({ src, width }) => (
    <div style={{
        textAlign: 'center',
    }}>
        <div
            style={{
                boxSizing: 'border-box',
                width,
                height: width,
                margin: 'auto',
                borderRadius: width / 2,
                background: 'transparent',
                backgroundImage: `url(/media/${src})`,
                backgroundPosition: 'center center',
                backgroundSize: 'cover',
            }}
        />
    </div>
)

PostImage.propTypes = {
    src: PropTypes.string.isRequired,
    width: PropTypes.number,
}

PostImage.defaultProps = {
    width: 80,
}

export default PostImage
